
-- Create notifications table for admin notifications
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id uuid REFERENCES public.societies(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  target_role text NOT NULL DEFAULT 'admin'
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Admins can view notifications for their society
CREATE POLICY "Admins can view society notifications"
ON public.notifications FOR SELECT
USING (
  has_role_in_society(auth.uid(), 'admin'::app_role, society_id)
  OR has_role(auth.uid(), 'super_admin'::app_role)
);

-- Admins can update (mark as read) notifications
CREATE POLICY "Admins can update society notifications"
ON public.notifications FOR UPDATE
USING (
  has_role_in_society(auth.uid(), 'admin'::app_role, society_id)
  OR has_role(auth.uid(), 'super_admin'::app_role)
);

-- System/super admin can insert notifications
CREATE POLICY "Super admins can manage notifications"
ON public.notifications FOR ALL
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Create a function to auto-create notification on new complaint
CREATE OR REPLACE FUNCTION public.notify_on_new_complaint()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.notifications (society_id, title, message, type)
  VALUES (
    NEW.society_id,
    'New Complaint: ' || NEW.title,
    'A new ' || NEW.priority || ' priority complaint has been submitted.',
    'complaint'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_complaint
AFTER INSERT ON public.complaints
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_new_complaint();

-- Notify on new visitor
CREATE OR REPLACE FUNCTION public.notify_on_new_visitor()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.notifications (society_id, title, message, type)
  VALUES (
    NEW.society_id,
    'Visitor: ' || NEW.visitor_name,
    COALESCE(NEW.purpose, 'Visit') || ' - Expected ' || COALESCE(NEW.expected_date::text, 'today'),
    'visitor'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_visitor
AFTER INSERT ON public.visitors
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_new_visitor();

-- Notify on new event
CREATE OR REPLACE FUNCTION public.notify_on_new_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.notifications (society_id, title, message, type)
  VALUES (
    NEW.society_id,
    'New Event: ' || NEW.title,
    COALESCE(NEW.description, 'A new event has been created.'),
    'event'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_event
AFTER INSERT ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_new_event();
