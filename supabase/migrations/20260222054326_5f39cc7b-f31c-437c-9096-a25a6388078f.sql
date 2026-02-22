
-- ============================================
-- 1. ENUM TYPES
-- ============================================
CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'super_admin');
CREATE TYPE public.maintenance_status AS ENUM ('paid', 'pending', 'overdue');
CREATE TYPE public.complaint_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE public.complaint_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.visitor_status AS ENUM ('expected', 'checked_in', 'checked_out');
CREATE TYPE public.event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');

-- ============================================
-- 2. SOCIETIES TABLE
-- ============================================
CREATE TABLE public.societies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.societies ENABLE ROW LEVEL SECURITY;

-- Anyone can view societies (for selection page)
CREATE POLICY "Anyone can view societies" ON public.societies FOR SELECT USING (true);

-- ============================================
-- 3. PROFILES TABLE
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 4. USER ROLES TABLE (SEPARATE from profiles!)
-- ============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  society_id UUID REFERENCES public.societies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role, society_id)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.has_role_in_society(_user_id UUID, _role app_role, _society_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role AND society_id = _society_id
  )
$$;

-- Users can view their own roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
-- Super admins can manage all roles
CREATE POLICY "Super admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- ============================================
-- 5. SOCIETY MEMBERS (links users to societies)
-- ============================================
CREATE TABLE public.society_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  society_id UUID NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, society_id)
);
ALTER TABLE public.society_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view own membership" ON public.society_members FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view society members" ON public.society_members FOR SELECT USING (
  public.has_role_in_society(auth.uid(), 'admin', society_id) OR public.has_role(auth.uid(), 'super_admin')
);
CREATE POLICY "Admins can manage members" ON public.society_members FOR ALL USING (
  public.has_role_in_society(auth.uid(), 'admin', society_id) OR public.has_role(auth.uid(), 'super_admin')
);

-- ============================================
-- 6. AMENITIES TABLE
-- ============================================
CREATE TABLE public.amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id UUID NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view society amenities" ON public.amenities FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.society_members WHERE user_id = auth.uid() AND society_id = amenities.society_id)
  OR public.has_role_in_society(auth.uid(), 'admin', society_id)
  OR public.has_role(auth.uid(), 'super_admin')
);
CREATE POLICY "Admins can manage amenities" ON public.amenities FOR ALL USING (
  public.has_role_in_society(auth.uid(), 'admin', society_id) OR public.has_role(auth.uid(), 'super_admin')
);

-- ============================================
-- 7. EVENTS TABLE
-- ============================================
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id UUID NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TEXT,
  location TEXT,
  image TEXT,
  status event_status NOT NULL DEFAULT 'upcoming',
  max_attendees INT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view society events" ON public.events FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.society_members WHERE user_id = auth.uid() AND society_id = events.society_id)
  OR public.has_role_in_society(auth.uid(), 'admin', society_id)
  OR public.has_role(auth.uid(), 'super_admin')
);
CREATE POLICY "Admins can manage events" ON public.events FOR ALL USING (
  public.has_role_in_society(auth.uid(), 'admin', society_id) OR public.has_role(auth.uid(), 'super_admin')
);

-- ============================================
-- 8. EVENT REGISTRATIONS
-- ============================================
CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own registrations" ON public.event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can register for events" ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can cancel own registration" ON public.event_registrations FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 9. MAINTENANCE RECORDS
-- ============================================
CREATE TABLE public.maintenance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id UUID NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  resident_name TEXT NOT NULL,
  month TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  due_date DATE NOT NULL,
  status maintenance_status NOT NULL DEFAULT 'pending',
  categories JSONB NOT NULL DEFAULT '[]',
  penalty NUMERIC NOT NULL DEFAULT 0,
  payment_date DATE,
  receipt_number TEXT,
  payment_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own maintenance" ON public.maintenance_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own maintenance" ON public.maintenance_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view society maintenance" ON public.maintenance_records FOR SELECT USING (
  public.has_role_in_society(auth.uid(), 'admin', society_id) OR public.has_role(auth.uid(), 'super_admin')
);
CREATE POLICY "Admins can manage maintenance" ON public.maintenance_records FOR ALL USING (
  public.has_role_in_society(auth.uid(), 'admin', society_id) OR public.has_role(auth.uid(), 'super_admin')
);

-- ============================================
-- 10. COMPLAINTS TABLE
-- ============================================
CREATE TABLE public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id UUID NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  priority complaint_priority NOT NULL DEFAULT 'medium',
  status complaint_status NOT NULL DEFAULT 'open',
  admin_response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own complaints" ON public.complaints FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create complaints" ON public.complaints FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own complaints" ON public.complaints FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view society complaints" ON public.complaints FOR SELECT USING (
  public.has_role_in_society(auth.uid(), 'admin', society_id) OR public.has_role(auth.uid(), 'super_admin')
);
CREATE POLICY "Admins can manage complaints" ON public.complaints FOR ALL USING (
  public.has_role_in_society(auth.uid(), 'admin', society_id) OR public.has_role(auth.uid(), 'super_admin')
);

-- ============================================
-- 11. VISITORS TABLE
-- ============================================
CREATE TABLE public.visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id UUID NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visitor_name TEXT NOT NULL,
  purpose TEXT,
  phone TEXT,
  expected_date DATE,
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  status visitor_status NOT NULL DEFAULT 'expected',
  vehicle_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own visitors" ON public.visitors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create visitors" ON public.visitors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own visitors" ON public.visitors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view society visitors" ON public.visitors FOR SELECT USING (
  public.has_role_in_society(auth.uid(), 'admin', society_id) OR public.has_role(auth.uid(), 'super_admin')
);
CREATE POLICY "Admins can manage visitors" ON public.visitors FOR ALL USING (
  public.has_role_in_society(auth.uid(), 'admin', society_id) OR public.has_role(auth.uid(), 'super_admin')
);

-- ============================================
-- 12. EMERGENCY CONTACTS
-- ============================================
CREATE TABLE public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id UUID NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view emergency contacts" ON public.emergency_contacts FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.society_members WHERE user_id = auth.uid() AND society_id = emergency_contacts.society_id)
  OR public.has_role_in_society(auth.uid(), 'admin', society_id)
  OR public.has_role(auth.uid(), 'super_admin')
);
CREATE POLICY "Admins can manage emergency contacts" ON public.emergency_contacts FOR ALL USING (
  public.has_role_in_society(auth.uid(), 'admin', society_id) OR public.has_role(auth.uid(), 'super_admin')
);

-- ============================================
-- 13. NOTICES TABLE
-- ============================================
CREATE TABLE public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id UUID NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  is_important BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view society notices" ON public.notices FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.society_members WHERE user_id = auth.uid() AND society_id = notices.society_id)
  OR public.has_role_in_society(auth.uid(), 'admin', society_id)
  OR public.has_role(auth.uid(), 'super_admin')
);
CREATE POLICY "Admins can manage notices" ON public.notices FOR ALL USING (
  public.has_role_in_society(auth.uid(), 'admin', society_id) OR public.has_role(auth.uid(), 'super_admin')
);

-- ============================================
-- 14. UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_societies_updated_at BEFORE UPDATE ON public.societies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_maintenance_updated_at BEFORE UPDATE ON public.maintenance_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON public.complaints FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
