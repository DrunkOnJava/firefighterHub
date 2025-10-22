-- Insert all 56 firefighters into the database
-- This data is from the original bolt.new database

-- First, disable RLS temporarily for insertion
ALTER TABLE public.firefighters DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_holds DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log DISABLE ROW LEVEL SECURITY;

-- Insert Shift A firefighters
INSERT INTO public.firefighters (id, name, order_position, is_available, shift, fire_station, is_active, certification_level, apparatus_ambulance, apparatus_brush_truck, apparatus_engine, apparatus_tanker, apparatus_truck, apparatus_boat, apparatus_utv, apparatus_rescue_squad, is_fto, is_bls, is_als) VALUES
('6d54eb9a-5805-474f-b87c-bab885842831', 'Josh Muller', 0, true, 'A', '5', true, 'EMT', true, true, true, false, false, false, false, false, false, false, false),
('75556027-6b91-403d-b1f7-cbb10ee57175', 'Angel Hernandez', 1, true, 'A', '2', true, 'EMT-A', true, true, true, true, false, true, true, false, false, false, false),
('62cc1d22-4feb-4774-bccf-a898be39bdca', 'Ryan Baldwin', 3, true, 'A', '8', true, 'EMT', true, true, true, true, true, true, true, true, true, false, true),
('3e4daf2c-96b2-49e1-8a62-b24bc3d5c3bb', 'Scott Richardson', 4, true, 'A', '6', true, 'EMT', true, true, true, true, true, true, true, true, true, false, false),
('f0c938fb-5288-4eae-86e8-4dd73bd74555', 'Cory McCauley', 5, true, 'A', '1', true, 'Paramedic', true, false, false, false, false, false, false, false, false, false, false),
('be61f00f-8ffa-45ba-aa66-8e127b5cc1b7', 'Josh Bryson', 6, true, 'A', '5', true, 'Paramedic', true, true, true, true, true, false, true, true, true, true, true),
('91b33991-8daf-4372-a400-33ff0aba5424', 'Andrew Feldhauser', 7, true, 'A', '1', true, 'Paramedic', true, true, true, true, true, true, true, true, true, true, true),
('10156b50-e327-446f-9f8a-55fee58d1a26', 'Kiersten Kennedy', 8, true, 'A', '8', true, 'EMT', true, true, true, true, false, false, true, true, true, false, false),
('f8ce1844-022f-4c7b-a856-92e52327149a', 'Noah Myers', 9, true, 'A', '1', true, 'EMT', true, true, true, true, false, false, true, false, false, false, false),
('1082f100-8583-493b-aa7b-a55db82c7587', 'Brandon Oliver', 10, true, 'A', '2', true, 'EMT', true, true, true, true, true, true, true, true, true, false, true),
('cb659f81-4b27-4770-a32c-c328719d6d45', 'Andrew Levdahl', 11, true, 'A', '3', true, 'EMT', true, true, true, true, true, true, true, true, true, false, true),
('295e1784-3ffb-44a8-a6cc-56cb80a99f1f', 'Chad Biby', 12, true, 'A', '6', true, 'EMT', true, false, false, false, false, false, false, false, false, false, false),
('7a4d063a-a0ea-428d-9835-71e1936ee130', 'Chris Pangle', 13, true, 'A', '4', true, 'EMT', true, true, true, true, true, false, true, false, false, false, false),
('a76790a6-168d-4e99-bc52-bc54de35bf86', 'Eddie Hammack', 14, true, 'A', '10', true, NULL, true, true, true, true, true, false, true, true, true, false, false),
('57dafb33-d2bb-468e-8670-abf1634ccafb', 'Ryan Fisher', 15, true, 'A', '3', true, 'EMT', true, true, true, true, false, true, true, false, false, false, false),
('5d99f418-1774-404a-9ce3-e55aad26556d', 'Austin Cucciardo', 16, true, 'A', '4', true, 'Paramedic', true, true, true, true, true, false, true, true, true, true, true),
('dc1cbc38-3c79-4f51-89a7-8677a0f7ad9f', 'John Smith', 17, true, 'A', '7', false, 'Paramedic', true, true, true, true, true, true, true, true, true, false, true);

-- Update John Smith's last_hold_date
UPDATE public.firefighters SET last_hold_date = '2025-10-21T00:00:00Z' WHERE id = 'dc1cbc38-3c79-4f51-89a7-8677a0f7ad9f';

-- Insert Shift B firefighters
INSERT INTO public.firefighters (id, name, order_position, is_available, shift, fire_station, is_active, certification_level, apparatus_ambulance, apparatus_brush_truck, apparatus_engine, apparatus_tanker, apparatus_truck, apparatus_boat, apparatus_utv, apparatus_rescue_squad, is_fto, is_bls, is_als) VALUES
('a758bfb1-4fc7-478a-9d33-ef92314deed9', 'Eric Depollo', 0, true, 'B', '4', true, 'Paramedic', true, false, false, false, false, false, false, false, false, false, false),
('d46b55d8-ad8d-42fd-abfd-29e9a11849fc', 'Michael Snell', 1, true, 'B', '1', true, 'EMT', false, false, false, false, false, false, false, false, false, false, false),
('66d2a23d-df73-4313-a754-9580adf87510', 'Dominic Cox', 2, true, 'B', '1', true, 'EMT', true, true, true, true, true, false, true, true, true, false, true),
('dabaceeb-d1d9-49ad-801b-e926244a2d3d', 'Chris Ramey', 3, true, 'B', '4', true, 'EMT', true, true, true, true, true, true, true, true, true, false, true),
('5f462678-8c53-40e9-91c9-89a023a2648e', 'Collin Cole', 4, true, 'B', '8', true, 'Paramedic', true, true, true, true, false, false, true, true, true, false, true),
('a3d02ce0-944f-4e3a-aaea-3619a5d70a13', 'Dylan Garrett', 5, true, 'B', '3', true, 'EMT', true, false, true, true, false, false, true, false, false, false, false),
('d45446ed-4244-431c-8c9d-bf8d2e184b45', 'Andy Volz', 6, true, 'B', '6', true, 'EMT', true, true, true, true, false, true, true, false, false, false, false),
('9c4c3c92-2b68-49cb-af39-091d27bbb519', 'Aaron Miller', 7, true, 'B', '5', true, 'EMT-A', true, true, true, true, true, true, true, true, true, false, true),
('53e36b7e-b961-4ab2-b7fc-b6d1f7d734d3', 'Bradley Kresge', 8, true, 'B', '2', true, 'EMT', true, true, true, true, false, false, false, true, true, false, false),
('0487cb18-26d8-42c0-92c3-94bafac1b346', 'Joe Gallivan', 9, true, 'B', '1', true, 'Paramedic', true, false, false, false, false, false, false, false, false, false, false),
('866af52e-5ebe-4fc8-b355-51bbf2e5b841', 'Camden Whitacre', 10, true, 'B', '1', true, 'Paramedic', true, true, true, true, true, true, true, true, true, true, true),
('ff71a94b-0936-4fb9-a42d-b6ea8b987247', 'Cassie Unger', 11, true, 'B', '2', true, 'Paramedic', true, true, true, true, true, true, true, true, true, true, true),
('08aefc32-5d16-4d99-8492-993737fde9ba', 'Cayden Baker', 12, true, 'B', '5', true, 'EMT', true, true, true, false, false, false, false, false, false, false, false),
('48754aaf-f139-4002-a44a-ac9c47ee3a32', 'Jared Lewis', 13, true, 'B', '10', true, 'Paramedic', true, true, true, true, true, true, true, true, true, true, true),
('7df1dcd2-2393-4944-8f72-c28b4514afd9', 'Michael Foster', 14, true, 'B', '10', true, 'EMT', true, true, true, false, false, false, true, false, false, false, false),
('eea43846-d27c-4168-95e3-a2fa543468d0', 'Gabe Malone', 15, true, 'B', '1', true, 'EMT', true, false, true, false, false, false, false, false, false, false, false),
('c611a48b-7cbf-4e4c-a7a9-aff8504a8f99', 'Tim Mawyer', 16, true, 'B', '3', true, 'EMT', true, true, true, true, true, true, true, true, true, false, true),
('d7402e28-a020-4e5a-9870-5d28f41ee3ae', 'Michael Good', 17, true, 'B', '8', true, 'EMT', true, true, true, false, false, false, false, false, false, false, false),
('58961078-5b49-4514-bcb8-a7545bbc49ac', 'Sierra Rollins', 18, true, 'B', '6', true, 'EMT', true, true, true, true, false, false, true, true, true, false, false),
('affc3726-65c8-46e9-86cb-95bca3c5a565', 'Matt Geurkink', 20, true, 'B', NULL, false, 'EMT', true, true, true, false, false, false, false, false, false, false, false);

-- Update Sierra Rollins' last_hold_date
UPDATE public.firefighters SET last_hold_date = '2025-10-18T00:00:00Z' WHERE id = '58961078-5b49-4514-bcb8-a7545bbc49ac';

-- Update Matt Geurkink's last_hold_date
UPDATE public.firefighters SET last_hold_date = '2025-10-20T00:00:00Z' WHERE id = 'affc3726-65c8-46e9-86cb-95bca3c5a565';

-- Insert Shift C firefighters
INSERT INTO public.firefighters (id, name, order_position, is_available, shift, fire_station, is_active, certification_level, apparatus_ambulance, apparatus_brush_truck, apparatus_engine, apparatus_tanker, apparatus_truck, apparatus_boat, apparatus_utv, apparatus_rescue_squad, is_fto, is_bls, is_als) VALUES
('25e2dae1-d693-4896-9aab-33b4d310775e', 'George Lewis', 0, true, 'C', '3', true, 'EMT', true, true, true, true, true, true, true, true, true, false, false),
('e4761d07-2c5f-477f-82d0-d9d91717dfad', 'Stephen Willocks', 1, true, 'C', '1', true, 'Paramedic', true, true, true, false, false, false, true, false, false, false, true),
('a635d61c-41a4-4ccd-b230-14c998a1f1c1', 'Dale Orebaugh', 2, true, 'C', '8', true, 'Paramedic', true, true, true, true, true, true, true, true, true, false, true),
('b97644dd-558b-4c56-b621-f51439695db6', 'Tony Maiatico', 3, true, 'C', '6', true, 'EMT', true, true, true, true, true, true, true, true, true, false, true),
('a40ce12a-9365-4137-aaeb-0e394ad976c3', 'Bernie Gottholm', 4, true, 'C', '2', true, 'EMT', true, true, true, true, true, true, true, true, true, false, true),
('4d09a03f-8104-42b3-8902-1f8de32b449c', 'Jeff Gray', 5, true, 'C', '5', true, 'EMT-A', true, true, true, true, true, true, true, false, false, false, false),
('1963b30f-6461-4cd6-9aa5-f14a293ea9ee', 'David Settle', 6, true, 'C', '1', true, 'EMT', true, false, false, false, false, false, false, false, false, false, false),
('8803253d-6326-4626-8279-bc8580346872', 'David Birks', 7, true, 'C', '3', true, 'EMT', true, false, false, false, false, false, false, false, false, false, false),
('9ae4e49f-17d1-4486-a0c2-7c16d6967409', 'Anisa Khan', 8, true, 'C', '10', true, 'EMT', true, true, true, false, false, false, true, false, false, false, false),
('69ec54e2-c19d-455e-9084-619eb9be70fd', 'Madison Udy', 9, true, 'C', '6', true, 'EMT', true, false, false, false, false, false, false, true, true, false, false),
('8320d1f2-b938-47eb-ba1c-6f48feed96ee', 'Joey Jock', 10, true, 'C', '5', true, 'EMT', true, true, true, true, true, true, true, true, true, false, false),
('e049dc7a-b24e-493b-b360-6f7bfd3cb4d2', 'Jaden Tipeni', 11, true, 'C', '2', true, 'EMT', true, true, true, true, false, true, true, false, false, false, false),
('65454ba6-2995-47f8-92f2-bbf5e94ea2ae', 'Jesse Smith', 12, true, 'C', '1', true, 'Paramedic', true, true, true, true, true, true, true, true, true, false, true),
('80016522-1312-4239-9412-5026d403a5fd', 'Logan Stewart', 13, true, 'C', '4', true, 'EMT', true, true, true, true, true, true, true, true, true, false, true),
('0f1f22b0-792f-4394-9308-046517f5f6f2', 'Madison Whitfield', 14, true, 'C', '1', true, 'EMT', true, true, true, true, true, false, true, true, true, false, true),
('4bd65ff8-1601-4f9e-aeae-6ca5d38ecb94', 'Jake Walker', 15, true, 'C', '8', true, 'EMT', true, true, true, true, false, false, true, true, true, false, false),
('7d554305-53f3-4718-bdac-2f66a6cfabad', 'Lisa Wilbanks', 16, true, 'C', '4', true, 'Paramedic', true, true, true, true, false, false, true, true, true, true, false),
('0c7cf713-b03e-4f6b-9347-1e7a5acc9d2e', 'TEST', 17, true, 'C', '1', false, 'EMT-I', false, false, false, false, false, false, false, true, true, true, false),
('48f7edf1-faf1-47d0-b4a1-ee6e479d20c3', 'Nick Bailey', 18, true, 'C', '10', true, 'Paramedic', true, true, true, true, true, false, true, true, true, true, false);

-- Update Nick Bailey's last_hold_date
UPDATE public.firefighters SET last_hold_date = '2025-10-19T00:00:00Z' WHERE id = '48f7edf1-faf1-47d0-b4a1-ee6e479d20c3';

-- Create public access policies
CREATE POLICY IF NOT EXISTS "Public read access" ON public.firefighters FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public insert access" ON public.firefighters FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Public update access" ON public.firefighters FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Public delete access" ON public.firefighters FOR DELETE USING (true);

CREATE POLICY IF NOT EXISTS "Public read access" ON public.scheduled_holds FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public insert access" ON public.scheduled_holds FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Public update access" ON public.scheduled_holds FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Public delete access" ON public.scheduled_holds FOR DELETE USING (true);

CREATE POLICY IF NOT EXISTS "Public read access" ON public.activity_log FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public insert access" ON public.activity_log FOR INSERT WITH CHECK (true);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Successfully inserted 56 firefighters!';
  RAISE NOTICE '   - Shift A: 17 firefighters';
  RAISE NOTICE '   - Shift B: 20 firefighters';
  RAISE NOTICE '   - Shift C: 19 firefighters';
END $$;
