
-- Allow admins to view profiles of members in their societies
CREATE POLICY "Admins can view member profiles" ON public.profiles
FOR SELECT USING (
  has_role(auth.uid(), 'super_admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM society_members sm
    JOIN user_roles ur ON ur.user_id = auth.uid() AND ur.role = 'admin'::app_role AND ur.society_id = sm.society_id
    WHERE sm.user_id = profiles.id
  )
);

-- Allow super admins to manage societies (insert, update, delete)
CREATE POLICY "Super admins can manage societies" ON public.societies
FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role));
