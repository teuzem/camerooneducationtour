/*
          # [Operation Name] Add 'sending' status to campaign
          [This operation adds a new 'sending' value to the campaign_status enum type. This allows the UI to show that a campaign is currently being processed by the server.]

          ## Query Description: [This operation alters an existing data type (enum). It is a structural change and is generally safe. It does not affect existing data but adds a new possible state for future records. No backup is required as this is a non-destructive, additive change.]
          
          ## Metadata:
          - Schema-Category: ["Structural"]
          - Impact-Level: ["Low"]
          - Requires-Backup: [false]
          - Reversible: [false]
          
          ## Structure Details:
          - Type: public.campaign_status
          
          ## Security Implications:
          - RLS Status: [Disabled]
          - Policy Changes: [No]
          - Auth Requirements: [None]
          
          ## Performance Impact:
          - Indexes: [Not Applicable]
          - Triggers: [Not Applicable]
          - Estimated Impact: [None]
          */
ALTER TYPE public.campaign_status ADD VALUE 'sending';
