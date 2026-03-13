
CREATE POLICY "Users can join a society"
ON public.society_members FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
