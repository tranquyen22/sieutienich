-- Add dual coins columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS regular_coins NUMERIC DEFAULT 5000 NOT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tq_coins NUMERIC DEFAULT 50000 NOT NULL;

-- Create coin_transactions table supporting dual coin categories (regular vs tq)
CREATE TABLE IF NOT EXISTS public.coin_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC NOT NULL,
    type TEXT NOT NULL,
    coin_category TEXT DEFAULT 'regular' NOT NULL,
    description TEXT NOT NULL
);

-- Enable RLS on coin_transactions table
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own coin transactions" 
ON public.coin_transactions FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own coin transactions" 
ON public.coin_transactions FOR INSERT 
WITH CHECK (true);

-- Enable Supabase Realtime for coin_transactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.coin_transactions;
