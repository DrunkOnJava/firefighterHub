import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const shiftA = [
  {id: '6d54eb9a-5805-474f-b87c-bab885842831', name: 'Josh Muller', order_position: 0, is_available: true, shift: 'A', fire_station: '5', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false},
  {id: '75556027-6b91-403d-b1f7-cbb10ee57175', name: 'Angel Hernandez', order_position: 1, is_available: true, shift: 'A', fire_station: '2', is_active: true, certification_level: 'EMT-A', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: false, apparatus_boat: true, apparatus_utv: true, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false},
  {id: '62cc1d22-4feb-4774-bccf-a898be39bdca', name: 'Ryan Baldwin', order_position: 3, is_available: true, shift: 'A', fire_station: '8', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: true, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: false},
  {id: '3e4daf2c-96b2-49e1-8a62-b24bc3d5c3bb', name: 'Scott Richardson', order_position: 4, is_available: true, shift: 'A', fire_station: '6', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: true, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: false},
  {id: 'f0c938fb-5288-4eae-86e8-4dd73bd74555', name: 'Cory McCauley', order_position: 5, is_available: true, shift: 'A', fire_station: '1', is_active: true, certification_level: 'Paramedic', apparatus_ambulance: true, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false},
  {id: 'be61f00f-8ffa-45ba-aa66-8e127b5cc1b7', name: 'Josh Bryson', order_position: 6, is_available: true, shift: 'A', fire_station: '5', is_active: true, certification_level: 'Paramedic', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: false, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: true},
  {id: '91b33991-8daf-4372-a400-33ff0aba5424', name: 'Andrew Feldhauser', order_position: 7, is_available: true, shift: 'A', fire_station: '1', is_active: true, certification_level: 'Paramedic', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: true, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: true},
  {id: '10156b50-e327-446f-9f8a-55fee58d1a26', name: 'Kiersten Kennedy', order_position: 8, is_available: true, shift: 'A', fire_station: '8', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: false, apparatus_boat: false, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: false},
  {id: 'f8ce1844-022f-4c7b-a856-92e52327149a', name: 'Noah Myers', order_position: 9, is_available: true, shift: 'A', fire_station: '1', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: false, apparatus_boat: false, apparatus_utv: true, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false},
  {id: '1082f100-8583-493b-aa7b-a55db82c7587', name: 'Brandon Oliver', order_position: 10, is_available: true, shift: 'A', fire_station: '2', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: true, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: false},
  {id: 'cb659f81-4b27-4770-a32c-c328719d6d45', name: 'Andrew Levdahl', order_position: 11, is_available: true, shift: 'A', fire_station: '3', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: true, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: false},
  {id: '295e1784-3ffb-44a8-a6cc-56cb80a99f1f', name: 'Chad Biby', order_position: 12, is_available: true, shift: 'A', fire_station: '6', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false},
  {id: '7a4d063a-a0ea-428d-9835-71e1936ee130', name: 'Chris Pangle', order_position: 13, is_available: true, shift: 'A', fire_station: '4', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: false, apparatus_utv: true, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false},
  {id: 'a76790a6-168d-4e99-bc52-bc54de35bf86', name: 'Eddie Hammack', order_position: 14, is_available: true, shift: 'A', fire_station: '10', is_active: true, certification_level: null, apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: false, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: false},
  {id: '57dafb33-d2bb-468e-8670-abf1634ccafb', name: 'Ryan Fisher', order_position: 15, is_available: true, shift: 'A', fire_station: '3', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: false, apparatus_boat: true, apparatus_utv: true, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false},
  {id: '5d99f418-1774-404a-9ce3-e55aad26556d', name: 'Austin Cucciardo', order_position: 16, is_available: true, shift: 'A', fire_station: '4', is_active: true, certification_level: 'Paramedic', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: false, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: true},
  {id: 'dc1cbc38-3c79-4f51-89a7-8677a0f7ad9f', name: 'John Smith', order_position: 17, is_available: true, shift: 'A', fire_station: '7', is_active: false, certification_level: 'Paramedic', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: true, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: false, last_hold_date: '2025-10-21'}
];

const shiftB = [
  {id: 'a758bfb1-4fc7-478a-9d33-ef92314deed9', name: 'Eric Depollo', order_position: 0, is_available: true, shift: 'B', fire_station: '4', is_active: true, certification_level: 'Paramedic', apparatus_ambulance: true, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false},
  {id: 'd46b55d8-ad8d-42fd-abfd-29e9a11849fc', name: 'Michael Snell', order_position: 1, is_available: true, shift: 'B', fire_station: '1', is_active: true, certification_level: 'EMT', apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false},
  {id: '66d2a23d-df73-4313-a754-9580adf87510', name: 'Dominic Cox', order_position: 2, is_available: true, shift: 'B', fire_station: '1', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: false, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: false},
  {id: 'dabaceeb-d1d9-49ad-801b-e926244a2d3d', name: 'Chris Ramey', order_position: 3, is_available: true, shift: 'B', fire_station: '4', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: true, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: false},
  {id: '5f462678-8c53-40e9-91c9-89a023a2648e', name: 'Collin Cole', order_position: 4, is_available: true, shift: 'B', fire_station: '8', is_active: true, certification_level: 'Paramedic', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: false, apparatus_boat: false, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: false},
  {id: 'a3d02ce0-944f-4e3a-aaea-3619a5d70a13', name: 'Dylan Garrett', order_position: 5, is_available: true, shift: 'B', fire_station: '3', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: false, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: false, apparatus_boat: false, apparatus_utv: true, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false},
  {id: 'd45446ed-4244-431c-8c9d-bf8d2e184b45', name: 'Andy Volz', order_position: 6, is_available: true, shift: 'B', fire_station: '6', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: false, apparatus_boat: true, apparatus_utv: true, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false},
  {id: '9c4c3c92-2b68-49cb-af39-091d27bbb519', name: 'Aaron Miller', order_position: 7, is_available: true, shift: 'B', fire_station: '5', is_active: true, certification_level: 'EMT-A', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: true, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: false},
  {id: '53e36b7e-b961-4ab2-b7fc-b6d1f7d734d3', name: 'Bradley Kresge', order_position: 8, is_available: true, shift: 'B', fire_station: '2', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: false},
  {id: '0487cb18-26d8-42c0-92c3-94bafac1b346', name: 'Joe Gallivan', order_position: 9, is_available: true, shift: 'B', fire_station: '1', is_active: true, certification_level: 'Paramedic', apparatus_ambulance: true, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false},
  {id: '866af52e-5ebe-4fc8-b355-51bbf2e5b841', name: 'Camden Whitacre', order_position: 10, is_available: true, shift: 'B', fire_station: '1', is_active: true, certification_level: 'Paramedic', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: true, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: true},
  {id: 'ff71a94b-0936-4fb9-a42d-b6ea8b987247', name: 'Cassie Unger', order_position: 11, is_available: true, shift: 'B', fire_station: '2', is_active: true, certification_level: 'Paramedic', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: true, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: true},
  {id: '08aefc32-5d16-4d99-8492-993737fde9ba', name: 'Cayden Baker', order_position: 12, is_available: true, shift: 'B', fire_station: '5', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false},
  {id: '48754aaf-f139-4002-a44a-ac9c47ee3a32', name: 'Jared Lewis', order_position: 13, is_available: true, shift: 'B', fire_station: '10', is_active: true, certification_level: 'Paramedic', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: true, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: true},
  {id: '7df1dcd2-2393-4944-8f72-c28b4514afd9', name: 'Michael Foster', order_position: 14, is_available: true, shift: 'B', fire_station: '10', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: true, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false},
  {id: 'eea43846-d27c-4168-95e3-a2fa543468d0', name: 'Gabe Malone', order_position: 15, is_available: true, shift: 'B', fire_station: '1', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: false, apparatus_engine: true, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false},
  {id: 'c611a48b-7cbf-4e4c-a7a9-aff8504a8f99', name: 'Tim Mawyer', order_position: 16, is_available: true, shift: 'B', fire_station: '3', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: true, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: false},
  {id: 'd7402e28-a020-4e5a-9870-5d28f41ee3ae', name: 'Michael Good', order_position: 17, is_available: true, shift: 'B', fire_station: '8', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false},
  {id: '58961078-5b49-4514-bcb8-a7545bbc49ac', name: 'Sierra Rollins', order_position: 18, is_available: true, shift: 'B', fire_station: '6', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: false, apparatus_boat: false, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: false, last_hold_date: '2025-10-18'},
  {id: 'affc3726-65c8-46e9-86cb-95bca3c5a565', name: 'Matt Geurkink', order_position: 20, is_available: true, shift: 'B', fire_station: null, is_active: false, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false, last_hold_date: '2025-10-20'}
];

const shiftC = [
  {id: '25e2dae1-d693-4896-9aab-33b4d310775e', name: 'George Lewis', order_position: 0, is_available: true, shift: 'C', fire_station: '3', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: true, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: false},
  {id: 'e4761d07-2c5f-477f-82d0-d9d91717dfad', name: 'Stephen Willocks', order_position: 1, is_available: true, shift: 'C', fire_station: '1', is_active: true, certification_level: 'Paramedic', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: true, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: true},
  {id: 'a635d61c-41a4-4ccd-b230-14c998a1f1c1', name: 'Dale Orebaugh', order_position: 2, is_available: true, shift: 'C', fire_station: '8', is_active: true, certification_level: 'Paramedic', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: true, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: false},
  {id: 'b97644dd-558b-4c56-b621-f51439695db6', name: 'Tony Maiatico', order_position: 3, is_available: true, shift: 'C', fire_station: '6', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: true, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: false},
  {id: 'a40ce12a-9365-4137-aaeb-0e394ad976c3', name: 'Bernie Gottholm', order_position: 4, is_available: true, shift: 'C', fire_station: '2', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: true, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: false},
  {id: '4d09a03f-8104-42b3-8902-1f8de32b449c', name: 'Jeff Gray', order_position: 5, is_available: true, shift: 'C', fire_station: '5', is_active: true, certification_level: 'EMT-A', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: true, apparatus_utv: true, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false},
  {id: '1963b30f-6461-4cd6-9aa5-f14a293ea9ee', name: 'David Settle', order_position: 6, is_available: true, shift: 'C', fire_station: '1', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false},
  {id: '8803253d-6326-4626-8279-bc8580346872', name: 'David Birks', order_position: 7, is_available: true, shift: 'C', fire_station: '3', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false},
  {id: '9ae4e49f-17d1-4486-a0c2-7c16d6967409', name: 'Anisa Khan', order_position: 8, is_available: true, shift: 'C', fire_station: '10', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: true, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false},
  {id: '69ec54e2-c19d-455e-9084-619eb9be70fd', name: 'Madison Udy', order_position: 9, is_available: true, shift: 'C', fire_station: '6', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: true, is_fto: true, is_bls: false, is_als: false},
  {id: '8320d1f2-b938-47eb-ba1c-6f48feed96ee', name: 'Joey Jock', order_position: 10, is_available: true, shift: 'C', fire_station: '5', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: true, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: false},
  {id: 'e049dc7a-b24e-493b-b360-6f7bfd3cb4d2', name: 'Jaden Tipeni', order_position: 11, is_available: true, shift: 'C', fire_station: '2', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: false, apparatus_boat: true, apparatus_utv: true, apparatus_rescue_squad: false, is_fto: false, is_bls: false, is_als: false},
  {id: '65454ba6-2995-47f8-92f2-bbf5e94ea2ae', name: 'Jesse Smith', order_position: 12, is_available: true, shift: 'C', fire_station: '1', is_active: true, certification_level: 'Paramedic', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: true, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: false},
  {id: '80016522-1312-4239-9412-5026d403a5fd', name: 'Logan Stewart', order_position: 13, is_available: true, shift: 'C', fire_station: '4', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: true, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: false},
  {id: '0f1f22b0-792f-4394-9308-046517f5f6f2', name: 'Madison Whitfield', order_position: 14, is_available: true, shift: 'C', fire_station: '1', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: false, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: false},
  {id: '4bd65ff8-1601-4f9e-aeae-6ca5d38ecb94', name: 'Jake Walker', order_position: 15, is_available: true, shift: 'C', fire_station: '8', is_active: true, certification_level: 'EMT', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: false, apparatus_boat: false, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: false},
  {id: '7d554305-53f3-4718-bdac-2f66a6cfabad', name: 'Lisa Wilbanks', order_position: 16, is_available: true, shift: 'C', fire_station: '4', is_active: true, certification_level: 'Paramedic', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: false, apparatus_boat: false, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: true},
  {id: '0c7cf713-b03e-4f6b-9347-1e7a5acc9d2e', name: 'TEST', order_position: 17, is_available: true, shift: 'C', fire_station: '1', is_active: false, certification_level: 'EMT-I', apparatus_ambulance: false, apparatus_brush_truck: false, apparatus_engine: false, apparatus_tanker: false, apparatus_truck: false, apparatus_boat: false, apparatus_utv: false, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: true},
  {id: '48f7edf1-faf1-47d0-b4a1-ee6e479d20c3', name: 'Nick Bailey', order_position: 18, is_available: true, shift: 'C', fire_station: '10', is_active: true, certification_level: 'Paramedic', apparatus_ambulance: true, apparatus_brush_truck: true, apparatus_engine: true, apparatus_tanker: true, apparatus_truck: true, apparatus_boat: false, apparatus_utv: true, apparatus_rescue_squad: true, is_fto: true, is_bls: true, is_als: true, last_hold_date: '2025-10-19'}
];

async function insertFirefighters() {
  console.log('🔥 Inserting all 56 firefighters into Supabase...\n');

  try {
    // Insert Shift A
    console.log('Inserting Shift A (17 firefighters)...');
    const { data: dataA, error: errorA } = await supabase
      .from('firefighters')
      .insert(shiftA);

    if (errorA) {
      console.error('Error inserting Shift A:', errorA);
      return;
    }
    console.log('✅ Shift A inserted');

    // Insert Shift B
    console.log('Inserting Shift B (20 firefighters)...');
    const { data: dataB, error: errorB } = await supabase
      .from('firefighters')
      .insert(shiftB);

    if (errorB) {
      console.error('Error inserting Shift B:', errorB);
      return;
    }
    console.log('✅ Shift B inserted');

    // Insert Shift C
    console.log('Inserting Shift C (19 firefighters)...');
    const { data: dataC, error: errorC } = await supabase
      .from('firefighters')
      .insert(shiftC);

    if (errorC) {
      console.error('Error inserting Shift C:', errorC);
      return;
    }
    console.log('✅ Shift C inserted');

    // Verify
    console.log('\nVerifying insertion...');
    const { count, error: countError } = await supabase
      .from('firefighters')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting:', countError);
    } else {
      console.log(`\n✅ SUCCESS! Total firefighters in database: ${count}`);
      console.log('   - Shift A: 17 firefighters');
      console.log('   - Shift B: 20 firefighters');
      console.log('   - Shift C: 19 firefighters');
      console.log('\n🎉 Refresh your browser to see all firefighters!');
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

insertFirefighters();
