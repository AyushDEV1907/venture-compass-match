
-- Create messages table for chat functionality
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users NOT NULL,
  recipient_id UUID REFERENCES auth.users NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE,
  conversation_id UUID NOT NULL
);

-- Create watchlists table for startup/investor bookmarking
CREATE TABLE public.watchlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  startup_id UUID REFERENCES public.startups,
  investor_id UUID REFERENCES public.investors,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT watchlist_item_check CHECK (
    (startup_id IS NOT NULL AND investor_id IS NULL) OR 
    (startup_id IS NULL AND investor_id IS NOT NULL)
  ),
  UNIQUE(user_id, startup_id),
  UNIQUE(user_id, investor_id)
);

-- Create matches table for tracking interests/connections
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  initiator_id UUID REFERENCES auth.users NOT NULL,
  target_id UUID REFERENCES auth.users NOT NULL,
  startup_id UUID REFERENCES public.startups,
  investor_id UUID REFERENCES public.investors,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(initiator_id, target_id, startup_id),
  UNIQUE(initiator_id, target_id, investor_id)
);

-- Create conversations table for organizing messages
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant1_id UUID REFERENCES auth.users NOT NULL,
  participant2_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(participant1_id, participant2_id)
);

-- Add RLS policies for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages" 
  ON public.messages 
  FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their received messages" 
  ON public.messages 
  FOR UPDATE 
  USING (auth.uid() = recipient_id);

-- Add RLS policies for watchlists
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own watchlist" 
  ON public.watchlists 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their watchlist" 
  ON public.watchlists 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their watchlist" 
  ON public.watchlists 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for matches
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their matches" 
  ON public.matches 
  FOR SELECT 
  USING (auth.uid() = initiator_id OR auth.uid() = target_id);

CREATE POLICY "Users can create matches" 
  ON public.matches 
  FOR INSERT 
  WITH CHECK (auth.uid() = initiator_id);

CREATE POLICY "Users can update matches they're involved in" 
  ON public.matches 
  FOR UPDATE 
  USING (auth.uid() = initiator_id OR auth.uid() = target_id);

-- Add RLS policies for conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their conversations" 
  ON public.conversations 
  FOR SELECT 
  USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);

CREATE POLICY "Users can create conversations" 
  ON public.conversations 
  FOR INSERT 
  WITH CHECK (auth.uid() = participant1_id OR auth.uid() = participant2_id);

-- Create indexes for better performance
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);
CREATE INDEX idx_watchlists_user_id ON public.watchlists(user_id);
CREATE INDEX idx_matches_participants ON public.matches(initiator_id, target_id);
CREATE INDEX idx_conversations_participants ON public.conversations(participant1_id, participant2_id);
