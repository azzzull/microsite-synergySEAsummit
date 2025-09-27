import { desc } from "framer-motion/client";

export const speakers = [
  {
    name: "Hwang Yun Tae",
    title: "Legacy Presidential Executive",
    photo: "/speakers/yun_tae_hwang.png",
    country: " ",
    cat: "speaker"
  },
  {
    name: "Takashi Oda",
    title: "Triple Presidential Executive",
    photo: "/speakers/takashi_oda.png",
    country: " ",
    cat: "speaker"
  },
  {
    name: "Ben Magalei",
    title: "Vice President Synergy Worldwide & President of Synergy",
    photo: "/speakers/ben_magalei.png",
    country: "Japan",
    cat: "gm"
  },
  
  {
    name: "Reza Darwis",
    title: "General Manager Synergy Worldwide",
    photo: "/speakers/gm_reza_darwis_indonesia.png",
    country: "Indonesia",
    cat: "gm"
  },
  {
    name: "Andy Lau",
    title: "General Manager Synergy Worldwide",
    photo: "/speakers/gm_andy_lau_malaysia.png",
    country: "Malaysia",
    cat: "gm"
  },
  {
    name: "Thon Klaewvigkrum",
    title: "General Manager Synergy Worldwide",
    photo: "/speakers/gm_thon_klaewvigkrum_thailand.png",
    country: "Thailand",
    cat: "gm"
  }
  
];

export const agenda = [
  {
    date: "2025-09-10",
    topic: "AI & Innovation in SEA"
  },
  {
    date: "2025-09-11",
    topic: "Fintech & Digital Transformation"
  },
  {
    date: "2025-09-12",
    topic: "Sustainable Tech & Bali Culture"
  }
];

import { HallOfFameMember } from "@/types/HallOfFame";

export const pinLevelImages: Record<string, string> = {
  "Presidential Executive": "/pins/presidential-executive.png",
  "Diamond Executive": "/pins/diamond-executive.png",
  "Emerald Executive": "/pins/emerald-executive.png",
  "Pearl Executive": "/pins/pearl-executive.png",
  "Team Elite": "/pins/team-elite.png",
  "Team Director": "/pins/team-director.png",
  "Team Manager": "/pins/team-manager.png",
  "Team Leader": "/pins/team-leader.png",
  "Gold": "/pins/recognition-gold.png",
  "Silver": "/pins/recognition-silver.png"
};

export const hallOfFame: HallOfFameMember[] = [
  {
    id: "1775252",
    name: "Chutidech Chalermpong & Pimpaphorn Themsukanan",
    photo: "/person/chutidech.png",
    pinLevel: "Presidential Executive",
    pinImage: pinLevelImages["Presidential Executive"],
    country: "Thailand"
  },
  {
    id: "287702",
    name: "Dian Citashara & Mohammad Rasyid",
    photo: "/person/dian.png",
    pinLevel: "Presidential Executive",
    pinImage: pinLevelImages["Presidential Executive"],
    country: "Indonesia"
  },
  {
    id: "1304945",
    name: "Kamphol Preechasirichok & Penporn Preechasirichok",
    photo: "/person/kamphol.png",
    pinLevel: "Presidential Executive",
    pinImage: pinLevelImages["Presidential Executive"],
    country: "Thailand"
  },
  {
    id: "961370",
    name: "Ni Nyoman Pariani &\nI Nyoman Soma Legawa",
    photo: "/person/ninyoman.png",
    pinLevel: "Presidential Executive",
    pinImage: pinLevelImages["Presidential Executive"],
    country: "Indonesia"
  },
  {
    id: "546684",
    name: "Hendro Soeyoto",
    photo: "/person/hendro.png",
    pinLevel: "Diamond Executive",
    pinImage: pinLevelImages["Diamond Executive"],
    country: "Indonesia"
  },
  {
    id: "986384",
    name: "I Wayan Pardika Rusiama",
    photo: "/person/iwayan.png",
    pinLevel: "Emerald Executive",
    pinImage: pinLevelImages["Emerald Executive"],
    country: "Indonesia"
    // recognition: "Recognition"
  },
  {
    id: "788016",
    name: "M. Riza Arif Budiman & Diah Febrina Satriani",
    photo: "/person/riza.png",
    pinLevel: "Emerald Executive",
    pinImage: pinLevelImages["Emerald Executive"],
    country: "Indonesia"
    // recognition: "Recognition"
  },
  {
    id: "2326096",
    name: "Nitaphat Utamakaew",
    photo: "/person/nitaphat.png",
    pinLevel: "Emerald Executive",
    pinImage: pinLevelImages["Emerald Executive"],
    country: "Thailand",
    recognition: "Recognition"
  },
  {
    id: "1797877",
    name: "Prachit Sriphol & Srirawun Sutthisan",
    photo: "/person/prachit.png",
    pinLevel: "Emerald Executive",
    pinImage: pinLevelImages["Emerald Executive"],
    country: "Thailand"
    // recognition: "Recognition"
  },
  {
    id: "710586",
    name: "Boh Chick Hint",
    photo: "/person/boh_chick_hint.png",
    pinLevel: "Pearl Executive",
    pinImage: pinLevelImages["Pearl Executive"],
    country: "Malaysia",
  },
  {
    id: "2329107",
    name: "Khin Swe Oo",
    photo: "/person/khin_swe_oo.png",
    pinLevel: "Pearl Executive",
    pinImage: pinLevelImages["Pearl Executive"],
    country: "Thailand",
    recognition: "Recognition",
  },
  {
    id: "818635",
    name: "Lodi Supangat & Fitria Aprianti",
    photo: "/person/lodi_supangat_fitria_aprianti.png",
    pinLevel: "Pearl Executive",
    pinImage: pinLevelImages["Pearl Executive"],
    country: "Indonesia",
  },
  {
    id: "1462568",
    name: "Nipon Rungraweesrisasithorn",
    photo: "/person/nipon_rungraweesrisasithorn.png",
    pinLevel: "Pearl Executive",
    pinImage: pinLevelImages["Pearl Executive"],
    country: "Thailand",
  },
  {
    id: "1635510",
    name: "Ridwan S & Nurzaita",
    photo: "/person/ridwan.png",
    pinLevel: "Pearl Executive",
    pinImage: pinLevelImages["Pearl Executive"],
    country: "Indonesia",
  },
  {
    id: "1798305",
    name: "Chairat Tongyen & Orathai Thongyen",
    photo: "/person/chairat_tongyen_orathai_thongyen.png",
    pinLevel: "Team Elite",
    pinImage: pinLevelImages["Team Elite"],
    country: "Thailand",
  },
  {
    id: "1006208",
    name: "Erpin Noor, S.Hut & Miniarti",
    photo: "/person/erpin_noor_miniarti.png",
    pinLevel: "Team Elite",
    pinImage: pinLevelImages["Team Elite"],
    country: "Indonesia",
  },
  {
    id: "1519642",
    name: "Hj Mia Nurmina Heriwati & Sandra D.E Kaunang",
    photo: "/person/hj_mia_nurmina_heriwati_sandra_de_kaunang.png",
    pinLevel: "Team Elite",
    pinImage: pinLevelImages["Team Elite"],
    country: "Indonesia",
  },
  {
    id: "939540",
    name: "Ir. Arie Dewanto & M. Rafi Rashad Budiman",
    photo: "/pins/team-elite.png",
    pinLevel: "Team Elite",
    pinImage: pinLevelImages["Team Elite"],
    country: "Indonesia",
  },
  {
    id: "1394438",
    name: "Ketor A Siloinyanan",
    photo: "/person/ketor_a_siloinyanan.png",
    pinLevel: "Team Elite",
    pinImage: pinLevelImages["Team Elite"],
    country: "Indonesia",
  },
  {
    id: "1129600",
    name: "Miske Sampaleng & Richardus Dapa Warga",
    photo: "/pins/team-elite.png",
    pinLevel: "Team Elite",
    pinImage: pinLevelImages["Team Elite"],
    country: "Indonesia",
  },
  {
    id: "1499773",
    name: "Ms Luh Lila Kertiasih & Aa Gde Rai Suriatmaja",
    photo: "/person/ms_luh_lila_kertiasih_aa_gde_rai_suriatmaja.png",
    pinLevel: "Team Elite",
    pinImage: pinLevelImages["Team Elite"],
    country: "Indonesia",
  },
  {
    id: "2403092",
    name: "Naw Kalayar Shwe Thway Kyi",
    photo: "/person/naw_kalayar_shwe_thway_kyi.png",
    pinLevel: "Team Elite",
    pinImage: pinLevelImages["Team Elite"],
    country: "Thailand",
    recognition: "Recognition",
  },
  {
    id: "1164037",
    name: "Sayu Putu Kasih",
    photo: "/person/sayu_putu_kasih.png",
    pinLevel: "Team Elite",
    pinImage: pinLevelImages["Team Elite"],
    country: "Indonesia",
  },
  {
    id: "1798326",
    name: "Thanet & Sumanee Chaisura",
    photo: "/person/thanet_sumanee_chaisura.png",
    pinLevel: "Team Elite",
    pinImage: pinLevelImages["Team Elite"],
    country: "Thailand",
  },
  {
    id: "1661230",
    name: "Tjahja Hananta",
    photo: "/person/tjahja_hananta.png",
    pinLevel: "Team Elite",
    pinImage: pinLevelImages["Team Elite"],
    country: "Indonesia",
  },
  {
    id: "2011289",
    name: "Aornprapa Jongarpasiri",
    photo: "/person/aornprapa_jongarpasiri.png",
    pinLevel: "Team Director",
    pinImage: pinLevelImages["Team Director"],
    country: "Thailand",
  },
  {
    id: "1798332",
    name: "Chaipiwat Tangjaitongdee",
    photo: "/person/chaipiwat_tangjaitongdee.png",
    pinLevel: "Team Director",
    pinImage: pinLevelImages["Team Director"],
    country: "Thailand",
  },
  {
    id: "1827043",
    name: "Kaewkakanang Niamsakha & Wachirawat Prakobporn",
    photo: "/person/kaewkakanang_niamsakha_wachirawat_prakobporn.png",
    pinLevel: "Team Director",
    pinImage: pinLevelImages["Team Director"],
    country: "Thailand",
  },
  {
    id: "1443080",
    name: "Lee Fong Keen",
    photo: "/pins/team-director.png",
    pinLevel: "Team Director",
    pinImage: pinLevelImages["Team Director"],
    country: "Malaysia",
  },
  {
    id: "713038",
    name: "Loh Chee Chin",
    photo: "/person/loh_chee_chin.png",
    pinLevel: "Team Director",
    pinImage: pinLevelImages["Team Director"],
    country: "Malaysia",
  },
  {
    id: "839083",
    name: "M. Umar Azis & Rr. Erning Yudhawati",
    photo: "/person/m_umar_azis_rr_erning_yudhawati.png",
    pinLevel: "Team Director",
    pinImage: pinLevelImages["Team Director"],
    country: "Indonesia",
  },
  {
    id: "1304431",
    name: "Murnita",
    photo: "/person/murnita.png",
    pinLevel: "Team Director",
    pinImage: pinLevelImages["Team Director"],
    country: "Indonesia",
  },
  {
    id: "886610",
    name: "N.S Kaithania & Djoko Martopo",
    photo: "/person/n_s_kaithania_djoko_martopo.png",
    pinLevel: "Team Director",
    pinImage: pinLevelImages["Team Director"],
    country: "Indonesia",
  },
  {
    id: "2403093",
    name: "Na Di Shwe Yee Hnin",
    photo: "/person/na_di_shwe_yee_hnin.png",
    pinLevel: "Team Director",
    pinImage: pinLevelImages["Team Director"],
    country: "Thailand",
    recognition: "Recognition",
  },
  {
    id: "1823872",
    name: "Nardrudee Suriyin & Skun Suriyin",
    photo: "/person/nardrudee_suriyin_skun_suriyin.png",
    pinLevel: "Team Director",
    pinImage: pinLevelImages["Team Director"],
    country: "Thailand",
  },
  {
    id: "1798020",
    name: "Paullawat & Pattaraporn Chutivoratapongsa",
    photo: "/person/paullawat_pattaraporn_chutivoratapongsa.png",
    pinLevel: "Team Director",
    pinImage: pinLevelImages["Team Director"],
    country: "Thailand",
  },
  {
    id: "1798255",
    name: "Pornthep Meeklai & Passamonporn Viwatmongkol",
    photo: "/person/pornthep_meeklai_passamonporn_viwatmongkol.png",
    pinLevel: "Team Director",
    pinImage: pinLevelImages["Team Director"],
    country: "Thailand",
  },
  {
    id: "271993",
    name: "Rosnani",
    photo: "/pins/team-director.png",
    pinLevel: "Team Director",
    pinImage: pinLevelImages["Team Director"],
    country: "Indonesia",
  },
  {
    id: "2010349",
    name: "Samroni & Isna Helti",
    photo: "/person/samroni_isna_helti.png",
    pinLevel: "Team Director",
    pinImage: pinLevelImages["Team Director"],
    country: "Indonesia",
  },
  {
    id: "1456883",
    name: "Siti Djulaikah",
    photo: "/person/siti_djulaikah.png",
    pinLevel: "Team Director",
    pinImage: pinLevelImages["Team Director"],
    country: "Indonesia",
  },
  {
    id: "1797712",
    name: "Sumalee Sukontharman",
    photo: "/person/sumalee_sukontharman.png",
    pinLevel: "Team Director",
    pinImage: pinLevelImages["Team Director"],
    country: "Thailand",
  },
  {
    id: "1127229",
    name: "Supardi & Fajar Eky Maryatie",
    photo: "/person/supardi_fajar_eky_maryatie.png",
    pinLevel: "Team Director",
    pinImage: pinLevelImages["Team Director"],
    country: "Indonesia",
  },
  {
    id: "2395992",
    name: "Than Than Nu",
    photo: "/person/than_than_nu.png",
    pinLevel: "Team Director",
    pinImage: pinLevelImages["Team Director"],
    country: "Thailand",
    recognition: "Recognition",
  },
  {
    id: "2396546",
    name: "Tin Ni Ni Shein",
    photo: "/person/tin_ni_ni_shein.png",
    pinLevel: "Team Director",
    pinImage: pinLevelImages["Team Director"],
    country: "Thailand",
    recognition: "Recognition",
  },
  {
    id: "1508171",
    name: "Yulita Dapa Wunga",
    photo: "/pins/team-director.png",
    pinLevel: "Team Director",
    pinImage: pinLevelImages["Team Director"],
    country: "Indonesia",
  },
  {
    id: "1798274",
    name: "Yutthana Kosolyutthasarn & Supenporn Pongsrisen",
    photo: "/person/yutthana_kosolyutthasarn_supenporn_pongsrisen.png",
    pinLevel: "Team Director",
    pinImage: pinLevelImages["Team Director"],
    country: "Thailand",
  },
  {
    id: "1771280",
    name: "Abdul Hamid",
    photo: "/pins/team-manager.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Indonesia",
  },
  {
    id: "1092775",
    name: "Agus Lidianto Kostaram & Novy Herlin Setiawati",
    photo: "/person/agus_lidianto_kostaram_novy_herlin_setiawati.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Indonesia",
  },
  {
    id: "2437100",
    name: "Aung Tin Myint",
    photo: "/person/aung_tin_myint.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
    recognition: "Recognition",
  },
  {
    id: "2403096",
    name: "Aye Aye Myint",
    photo: "/person/aye_aye_myint.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
    recognition: "Recognition",
  },
  {
    id: "1791271",
    name: "Benjarat Manakhantikul",
    photo: "/person/benjarat_manakhantikul.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
  },
  {
    id: "1878382",
    name: "Boonyarat Meesuwan",
    photo: "/person/boonyarat_meesuwan.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
  },
  {
    id: "1902581",
    name: "Chitvaree Pankham",
    photo: "/person/chitvaree_pankham.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
  },
  {
    id: "1079103",
    name: "Dewi Anetaria Siahaan",
    photo: "/person/dewi_anetaria_siahaan.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Indonesia",
  },
  {
    id: "1864240",
    name: "Didit Raditya Wijaya",
    photo: "/person/didit_raditya_wijaya.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Indonesia",
  },
  {
    id: "1547074",
    name: "Enri Rasjidin",
    photo: "/pins/team-manager.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Indonesia",
  },
  {
    id: "1536868",
    name: "I Ketut Ada Astawa",
    photo: "/person/i_ketut_ada_astawa.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Indonesia",
  },
  {
    id: "1967741",
    name: "Kittipong Natetong",
    photo: "/person/kittipong_natetong.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
  },
  {
    id: "2396084",
    name: "Kyaw Hlaing",
    photo: "/person/kyaw_hlaing.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
  },
  {
    id: "2025504",
    name: "Ladawan Nedvijit",
    photo: "/person/ladawan_nedvijit.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
  },
  {
    id: "2173316",
    name: "Lee Wee Siong",
    photo: "/person/lee_wee_siong.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Malaysia",
  },
  {
    id: "1224741",
    name: "Lenny Makai",
    photo: "/pins/team-manager.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Indonesia",
  },
  {
    id: "1959835",
    name: "Leow Chee Peng",
    photo: "/person/leow_chee_peng.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Malaysia",
  },
  {
    id: "1954522",
    name: "Loh Siang Beng",
    photo: "/person/loh_siang_beng.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Malaysia",
  },
  {
    id: "1937125",
    name: "Mayza Dewayani & T. Denie T.",
    photo: "/person/mayza_dewayani_t_denie_t.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Indonesia",
  },
  {
    id: "1990048",
    name: "Naruphon Phanthang",
    photo: "/person/naruphon_phanthang.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
  },
  {
    id: "1820364",
    name: "Ng Chee Wah",
    photo: "/person/ng_chee_wah.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Malaysia",
  },
  {
    id: "2402856",
    name: "Ni Ni Aung",
    photo: "/person/ni_ni_aung.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
    recognition: "Recognition",
  },
  {
    id: "2414262",
    name: "Nilar Aye",
    photo: "/person/nilar_aye.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
    recognition: "Recognition",
  },
  {
    id: "1966921",
    name: "Nilmya Nilaswini",
    photo: "/person/nilmya_nilaswini.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Indonesia",
  },
  {
    id: "2023793",
    name: "Nipitcha Themsukanan",
    photo: "/person/nipitcha_themsukanan.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
  },
  {
    id: "1797737",
    name: "Nuchjaree Patchimasiri",
    photo: "/person/nuchjaree_patchimasiri.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
  },
  {
    id: "2414263",
    name: "Ohn Mar Zin",
    photo: "/person/ohn_mar_zin.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
  },
  {
    id: "2402610",
    name: "Pichayut & Uangphon Jenareewong",
    photo: "/person/pichayut_uangphon_jenareewong.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
    recognition: "Recognition",
  },
  {
    id: "1720884",
    name: "Piyawat & Phatphimon Detphiphatthanaphokhin",
    photo: "/person/piyawat_phatphimon_detphiphatthanaphokhin.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
  },
  {
    id: "1799686",
    name: "Pranee & Hem Emem",
    photo: "/person/pranee_hem_emem.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
  },
  {
    id: "1291295",
    name: "Putu Ary Santosa & Sayu Made Sukerti",
    photo: "/pins/team-manager.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Indonesia",
  },
  {
    id: "1761731",
    name: "Rahmad Dijaya",
    photo: "/person/rahmad_dijaya.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Indonesia",
  },
  {
    id: "2027616",
    name: "Safaruddin",
    photo: "/pins/team-manager.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Indonesia",
  },
  {
    id: "2437102",
    name: "Shine Htet Aung",
    photo: "/person/shine_htet_aung.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
    recognition: "Recognition",
  },
  {
    id: "2396937",
    name: "Soe Maung",
    photo: "/pins/team-manager.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
    recognition: "Recognition",
  },
  {
    id: "1704650",
    name: "Somjai Sittigul & Isaraporn Kaewchom",
    photo: "/person/somjai_sittigul_isaraporn_kaewchom.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
  },
  {
    id: "1660549",
    name: "Sri Hartatik",
    photo: "/person/sri_hartatik.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Indonesia",
  },
  {
    id: "2418413",
    name: "Su Su Tun",
    photo: "/person/su_su_tun.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
    recognition: "Recognition",
  },
  {
    id: "1921751",
    name: "Talyarasn & Nikorn Kirdkaew",
    photo: "/person/talyarasn_nikorn_kirdkaew.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
  },
  {
    id: "1512328",
    name: "Tanty Silviyanti / L. Azhabuddin T",
    photo: "/pins/team-manager.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Indonesia",
  },
  {
    id: "2106499",
    name: "Thamontorn Nutapatorn",
    photo: "/person/thamontorn_nutapatorn.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
  },
  {
    id: "1798523",
    name: "Thanakit Taweechaimongkol",
    photo: "/person/thanakit_taweechaimongkol.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
  },
  {
    id: "2312327",
    name: "Thanathip Lamungthong & Prapai Singmui",
    photo: "/person/thanathip_lamungthong_prapai_singmui.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
  },
  {
    id: "1227297",
    name: "Wahyudi Wahyudi",
    photo: "/person/wahyudi_wahyudi.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Indonesia",
  },
  {
    id: "1826650",
    name: "Wilai Thaiphithak",
    photo: "/person/wilai_thaiphithak.png",
    pinLevel: "Team Manager",
    pinImage: pinLevelImages["Team Manager"],
    country: "Thailand",
  },
  {
    id: "1935045",
    name: "Ade Sasmito Agung",
    photo: "/pins/team-leader.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Indonesia",
  },
  {
    id: "1723605",
    name: "Agus Saefulloh",
    photo: "/person/agus_saefulloh.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Indonesia",
  },
  {
    id: "2355205",
    name: "Ang Chiang An",
    photo: "/person/ang_chiang_an.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Malaysia",
    recognition: "Recognition",
  },
  {
    id: "1799700",
    name: "Anunya Tangcharoen",
    photo: "/person/anunya_tangcharoen.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "1727071",
    name: "Anusuya Theyvanboo",
    photo: "/person/anusuya_theyvanboo.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Malaysia",
  },
  {
    id: "2396464",
    name: "Aye Aye Myaing",
    photo: "/person/aye_aye_myaing.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "2475099",
    name: "Aye Thidar Lwin",
    photo: "/person/aye_thidar_lwin.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "1798329",
    name: "Bamroong Kourkij",
    photo: "/person/bamroong_kourkij.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "2402615",
    name: "Chayakorn Chutivoratapongsa",
    photo: "/person/chayakorn_chutivoratapongsa.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
    recognition: "Recognition",
  },
  {
    id: "2054150",
    name: "Dollaporn Tangkietudom",
    photo: "/person/dollaporn_tangkietudom.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "1821733",
    name: "Heng Geek Hong",
    photo: "/person/heng_geek_hong.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Malaysia",
  },
  {
    id: "2414268",
    name: "Hwee Thein @ Chan Hwee Thein",
    photo: "/person/hwee_thein_chan_hwee_thein.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "1338766",
    name: "I Putu Brata Puspa & Ni Ketut Sukarmi",
    photo: "/pins/team-leader.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Indonesia",
  },
  {
    id: "2308346",
    name: "Intheran Ramasamy",
    photo: "/person/intheran_ramasamy.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Malaysia",
  },
  {
    id: "1639238",
    name: "Irgahayu Syam",
    photo: "/person/irgahayu_syam.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Indonesia",
  },
  {
    id: "2067446",
    name: "Kamonsri Phanchampa",
    photo: "/person/kamonsri_phanchampa.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "2458431",
    name: "Kamonwan Sodchuen",
    photo: "/person/kamonwan_sodchuen.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
    recognition: "Recognition",
  },
  {
    id: "2313546",
    name: "Kanta & Arut Kantawilaskul",
    photo: "/person/kanta_arut_kantawilaskul.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "2396547",
    name: "Khin Khin Wai",
    photo: "/person/khin_khin_wai.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "2461971",
    name: "Khin Mar San",
    photo: "/person/khin_mar_san.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "2397273",
    name: "Khin Nyo Win",
    photo: "/person/khin_nyo_win.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "2339284",
    name: "Koos Fitriani",
    photo: "/person/koos_fitriani.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Indonesia",
    recognition: "Recognition",
  },
  {
    id: "2468168",
    name: "Kotchaporn Panthanawarakorn",
    photo: "/person/kotchaporn_panthanawarakorn.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
    recognition: "Recognition",
  },
  {
    id: "100012259",
    name: "Kyaw Lin Aung",
    photo: "/pins/team-leader.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "1480057",
    name: "Liau Cheng Kiat",
    photo: "/person/liau_cheng_kiat.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Malaysia",
  },
  {
    id: "2220684",
    name: "Lim Chun Ean",
    photo: "/pins/team-leader.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Malaysia",
  },
  {
    id: "2275826",
    name: "Lutfil Khakim & Firdausy Musa",
    photo: "/person/lutfil_khakim_firdausy_musa.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Indonesia",
  },
  {
    id: "2402853",
    name: "Mar Mar Lay",
    photo: "/person/mar_mar_lay.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "1924402",
    name: "Marselo & Vici Rama Melia",
    photo: "/person/marselo_vici_rama_melia.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Indonesia",
    recognition: "Recognition",
  },
  {
    id: "2397194",
    name: "Moe Moe Aye",
    photo: "/person/moe_moe_aye.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "2366633",
    name: "Monlux Sarutilawan & Pongpakorn Sarutilawan",
    photo: "/person/monlux_sarutilawan_pongpakorn_sarutilawan.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "100013121",
    name: "Nang Myint Myint Aye",
    photo: "/pins/team-leader.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "2403929",
    name: "Naphattrarat Jaikwang",
    photo: "/person/naphattrarat_jaikwang.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
    recognition: "Recognition",
  },
  {
    id: "2054152",
    name: "Narumol Khongjaroenthin & Thitima  Phanjumpa",
    photo: "/person/narumol_khongjaroenthin.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "100013329",
    name: "Nay Win Naing",
    photo: "/pins/team-leader.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "1006314",
    name: "Ni Luh Intan Lestary &\nI Made Dugdug Arcana",
    photo: "/pins/team-leader.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Indonesia",
  },
  {
    id: "1989968",
    name: "Ni Nyoman Suartini",
    photo: "/person/ni_nyoman_suartini.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Indonesia",
  },
  {
    id: "1888724",
    name: "Nira Sulianti & Biran",
    photo: "/person/nira_sulianti_biran.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Indonesia",
  },
  {
    id: "2091512",
    name: "Nurnas Rumadan",
    photo: "/pins/team-leader.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Indonesia",
  },
  {
    id: "1514296",
    name: "Paneenat Khanthong",
    photo: "/person/paneenat_khanthong.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "1879764",
    name: "Panom Thongyoy",
    photo: "/person/panom_thongyoy.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "2099695",
    name: "Phattharaporn Phanthung",
    photo: "/person/phattharaporn_phanthung.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "2430918",
    name: "Phonphat Phudtikamoltorn",
    photo: "/person/phonphat_phudtikamoltorn.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "2313550",
    name: "Pipatkan Phansiripol",
    photo: "/person/pipatkan_phansiripol.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "100012201",
    name: "Sar Hpaw Lay @ Aye Aye Tin",
    photo: "/pins/team-leader.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "2313547",
    name: "Saralai Saruk",
    photo: "/person/saralai_saruk.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "2402613",
    name: "Sira Thamkamson",
    photo: "/person/sira_thamkamson.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
    recognition: "Recognition",
  },
  {
    id: "2396943",
    name: "Soe Win Myint",
    photo: "/pins/team-leader.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "2461677",
    name: "Su Myat Thidar",
    photo: "/person/su_myat_thidar.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "2414174",
    name: "Su Su Pyae Win",
    photo: "/person/su_su_pyae_win.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "1921145",
    name: "Surapee Sopha",
    photo: "/person/surapee_sopha.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "2178005",
    name: "Tan Siew Ling",
    photo: "/person/tan_siew_ling.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Malaysia",
    recognition: "Recognition",
  },
  {
    id: "2328274",
    name: "Teng Pik Leang",
    photo: "/person/teng_pik_leang.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Malaysia",
  },
  {
    id: "1086847",
    name: "Tuty Sumiyati",
    photo: "/pins/team-leader.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Indonesia",
  },
  {
    id: "2158097",
    name: "Unyapath Jhompinit",
    photo: "/person/unyapath_jhompinit.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "2174736",
    name: "Vanida Thongketkaew",
    photo: "/person/vanida_thongketkaew.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "2399085",
    name: "Veeraphat Horcharoensap",
    photo: "/person/veeraphat_horcharoensap.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "1791267",
    name: "Waiyawut Manakhantikul",
    photo: "/person/waiyawut_manakhantikul.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "2029907",
    name: "Widia Saputri",
    photo: "/pins/team-leader.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Indonesia",
  },
  {
    id: "2403084",
    name: "Win Hlaing Phyu",
    photo: "/person/win_hlaing_phyu.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "2414170",
    name: "Win Win Lay",
    photo: "/person/win_win_lay.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "2409998",
    name: "Ye Win",
    photo: "/person/ye_win.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "100012763",
    name: "Zaw Tun Aung",
    photo: "/person/zaw_tun_aung.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "2450147",
    name: "Zin Mar Tun",
    photo: "/person/zin_mar_tun.png",
    pinLevel: "Team Leader",
    pinImage: pinLevelImages["Team Leader"],
    country: "Thailand",
  },
  {
    id: "2462707",
    name: "Koh Gek Peng",
    photo: "/pins/recognition-silver.png",
    pinLevel: "Silver",
    pinImage: pinLevelImages["Silver"],
    country: "Malaysia",
    recognition: "Recognition",
  },
  {
    id: "2492492",
    name: "Chin Poay Ling",
    photo: "/pins/recognition-silver.png",
    pinLevel: "Silver",
    pinImage: pinLevelImages["Silver"],
    country: "Malaysia",
    recognition: "Recognition",
  },
  {
    id: "2484939",
    name: "Lau Wei Peng",
    photo: "/pins/recognition-silver.png",
    pinLevel: "Silver",
    pinImage: pinLevelImages["Silver"],
    country: "Malaysia",
    recognition: "Recognition",
  },
  {
    id: "2420790",
    name: "Ratih Sugihharti, SE & Erry S. Wijaya",
    photo: "/pins/recognition-silver.png",
    pinLevel: "Silver",
    pinImage: pinLevelImages["Silver"],
    country: "Indonesia",
    recognition: "Recognition",
  },
  {
    id: "2504301",
    name: "Tjong Siok Chin",
    photo: "/pins/recognition-silver.png",
    pinLevel: "Silver",
    pinImage: pinLevelImages["Silver"],
    country: "Indonesia",
    recognition: "Recognition",
  },
  {
    id: "2378905",
    name: "Nathan M.P. Sembiring",
    photo: "/pins/recognition-silver.png",
    pinLevel: "Silver",
    pinImage: pinLevelImages["Silver"],
    country: "Indonesia",
    recognition: "Recognition",
  },
  {
    id: "2294069",
    name: "Balu Nadarajan",
    photo: "/pins/recognition-gold.png",
    pinLevel: "Gold",
    pinImage: pinLevelImages["Gold"],
    country: "Malaysia",
    recognition: "Recognition",
  },
  // Add more members as needed
];

export const hotels = [
  { 
    name: "Pullman Bali Legian Beach", 
    description: "The perfect blend of sun-kissed relaxation and contemporary elegance tucked in the bustling Kuta and Legian area, the resort embodies a laid-back sophistication that promises an unforgettable escape.",
    photo: "/hotel/PullmanBali.jpg",
    distance: "1 minutes from venue",
    bookingLink: "https://www.pullman-bali-legianbeach.com/"
  },
  { 
    name: "Mamaka by Ovolo", 
    description: "MAMAKA by Ovolo is a luxury hotel with a youthful spirit. So youthful, in fact, that the list of complimentary amenities — self-service laundry, morning coffee, happy-hour drinks — might remind you of the nicest hostel you stayed",
    photo: "/hotel/Mamaka.jpg",
    distance: "2 minutes from venue",
    bookingLink: "https://ovolohotels.com/mamaka"
  },
  { 
    name: "Amaris Hotel Kuta", 
    description: "Amaris Hotel Kuta is a trendy hotel in the heart of the famous Legian area in Kuta, Bali. Surrounded by chic restaurants and a lively nightlife scene, Amaris Hotel Kuta provides some of the best that the island has to offer.",
    photo: "/hotel/amaris.jpg",
    distance: "4 minutes from venue",
    bookingLink: "https://www.mysantika.com/indonesia/badung/amaris-hotel-lebak-bene-kuta-bali"
  },
  { 
    name: "Pop Hotel Kuta Beach", 
    description: "POP! Hotel Kuta Beach is the perfect place to stay that provides decent facilities as well as great services. POP! Hotel Kuta Beach is the smartest choice for you who are looking for affordable accommodation with outstanding service",
    photo: "/hotel/pophotel.jpg",
    distance: "5 minutes from venue",
    bookingLink: "https://www.discoverasr.com/en/pop-hotels/indonesia/pop-hotel-kuta-beach-bali"
  },
  { 
    name: "Four Points by Sheraton Bali", 
    description: "Four Points by Sheraton Bali, Kuta is a contemporary hotel nestled at the heart of the Legian-Kuta area, offering an island holiday vibe with modern comforts. ",
    photo: "/hotel/fourpoints.jpg",
    distance: "11 minutes from venue",
    bookingLink: "https://www.marriott.com/en-us/hotels/dpsfp-four-points-bali-kuta/overview/"
  },
  { 
    name: "Champlung Mas Hotel", 
    description: "Champlung Mas Hotel & Spa is a welcoming four-star hotel located in the heart of Legian, Bali. Accommodation is uniquely designed with contemporary decor.",
    photo: "/hotel/champlung.jpg",
    distance: "11 minutes from venue",
    bookingLink: "https://champlungmaslegian.com/"
  },
  { 
    name: "Mercure Bali Legian", 
    description: "Mercure Kuta Bali is ideal for travelers who want direct beach access, vibrant surroundings, and a hotel that combines resort-like relaxation with urban convenience",
    photo: "/hotel/mercure.jpg",
    distance: "12 minutes from venue",
    bookingLink: "https://all.accor.com/hotel/8450/index.en.shtml"
  },
  { 
    name: "Hard Rock Hotel Bali", 
    description: "Hard Rock Hotel Bali is a vibrant, music-inspired beachfront hotel located on Kuta Beach, known for combining entertainment with upscale resort-style amenities.",
    photo: "/hotel/hardrock.jpg",
    distance: "12 minutes from venue",
    bookingLink: "https://www.hardrockhotels.com/bali/"
  },
  { 
    name: "Aloft Bali Kuta at Beachwalk", 
    description: "Aloft Bali Kuta at Beachwalk brings a fresh, vibrant energy to the heart of Kuta. Just steps from Kuta Beach and directly connected to Beachwalk Mall, this modern lifestyle hotel blends bold design with playful social spaces—perfect for both relaxation and networking.",
    photo: "/hotel/aloft.jpg",
    distance: "13 minutes from venue",
    bookingLink: "https://www.marriott.com/en-us/hotels/dpska-aloft-bali-kuta-at-beachwalk/overview/"
  },
  { 
    name: "The Kuta Beach Heritage Hotel", 
    description: "The Kuta Beach Heritage Hotel – Managed by Accor offers a refined blend of modern luxury and Balinese coastal charm, ideally located just steps from Kuta Beach. With 159 well-appointed rooms inspired by seaside village life—surfing, sailing, fishing—the hotel captures a relaxed yet elegant aesthetic.",
    photo: "/hotel/thekuta.jpg",
    distance: "15 minutes from venue",
    bookingLink: "https://all.accor.com/hotel/8151/index.en.shtml"
  }
];

// export const restaurants = [
//   { 
//     name: "Gabah Padma Bali", 
//     rating: 4.8, 
//     description: "Gabah Padma Bali combines authentic Indonesian flavors with the freshness of local seafood. Open all day, the restaurant serves hearty breakfasts, flavorful lunches, and intimate dinners in a warm, relaxed setting. Perfect for guests looking to enjoy traditional tastes in the heart of Legian.",
//     link: "https://maps.google.com/maps?saddr=&daddr=Jl.%20Padma%20Rama%20Residence%20Padma,%20Legian%2080361%20Indonesia@-8.706263,115.168396" 
//   },
//   { 
//     name: "Azul Beach Club", 
//     rating: 4.7, 
//     description: "Azul Beach Club is a bamboo treehouse with Bali’s first Tiki Bar, infinity pool, and ocean views. The turquoise design blends tropical chic with comfort, while Chef Arief Wicaksono’s menu highlights creative dishes. Whether day or night, Azul offers a vibrant beachside dining and lounge experience.",
//     link: "https://maps.google.com/maps?saddr=&daddr=Jl.%20Padma%20No.%202%20Bali%20Mandira%20Beach%20Resort%20&%20Spa,%20Legian%2080361%20Indonesia@-8.707295,115.16657" 
//   },
//   { 
//     name: "Makan Place", 
//     rating: 4.7, 
//     description: "Makan Place embraces the philosophy of sharing, serving generous Asian and Western dishes ideal for groups. Highlights include the 800-gram Balinese Crackling Pork Knuckle and fresh salad bowls for vegetarians. With creative cocktails and a lively atmosphere, it has become a favorite dining spot in Legian.",
//     link: "https://maps.google.com/maps?saddr=&daddr=Jl.%20Padma%20No.1,%20Legian%2080361%20Indonesia@-8.70608,115.16805" 
//   },
//   { 
//     name: "Donbiu", 
//     rating: 4.9, 
//     description: "Donbiu offers a relaxed Balinese-inspired setting with international and local favorites. Open for breakfast and dinner, the restaurant features themed buffets and live performances ranging from acoustic music to cultural shows. With friendly service and warm ambiance, Donbiu provides a memorable dining experience in Legian.",
//     link: "https://maps.google.com/maps?saddr=&daddr=Jl.%20Padma%20No.%201%20Padma%20Resort%20Bali,%20Legian%2080361%20Indonesia@-8.705245,115.16653" 
//   },
//   { 
//     name: "Lemongrass Thai", 
//     rating: 4.2, 
//     description: "Lemongrass Thai, open since 2001, serves freshly cooked Thai cuisine with vegetarian, vegan, and gluten-free options. Located on Melasti Street, it offers open-air and air-conditioned seating plus a full bar. Guests enjoy a casual, welcoming vibe, attentive service, and flavorful dishes perfect for sharing with friends.",
//     link: "https://maps.google.com/maps?saddr=&daddr=Jl.%20Melasti,%20Legian%2080361%20Indonesia@-8.708616,115.17081" 
//   },
//   { 
//     name: "Skai Bar & Grill", 
//     rating: 5.0, 
//     description: "Skai Bar & Grill blends tropical charm with refined style, inspired by a modern beach house. Guests can savor Mediterranean-inspired cuisine and curated drinks while enjoying Bali’s breathtaking sunsets. With its stylish yet casual vibe, Skai is perfect for both relaxed afternoons and lively evenings by the sea.",
//     link: "https://maps.google.com/maps?saddr=&daddr=Jl.%20Padma%20No.%201%20Legian%20-%20Bali%2080361%20Indonesia,%20Legian%2080361%20Indonesia@-8.705406,115.16678" 
//   },
//   { 
//     name: "Sheppy`s Bar and Restaurant", 
//     rating: 4.4, 
//     description: "Sheppy’s offers a family-friendly setting with affordable meals and drinks. The menu includes Australian classics like schnitzels and fish and chips, alongside Indonesian favorites. Sports fans enjoy big-screen coverage of live games, while families appreciate the smoke-free area and half-sized meals for children. A local favorite in Legian.",
//     link: "https://maps.google.com/maps?saddr=&daddr=Jl%20Melasti%20no%2025,%20Legian%20Indonesia@-8.70881,115.169334" 
//   },
//   { 
//     name: "Rama Garden Restaurant & Sports Bar", 
//     rating: 4.5, 
//     description: "Rama Garden blends international and Indonesian flavors in an open-air setting. Serving from breakfast to late evening, it’s popular for affordable meals and live sports on giant screens. With friendly service, evening entertainment, and a lively atmosphere, it’s a great spot to dine and socialize in Legian.",
//     link: "https://maps.google.com/maps?saddr=&daddr=Jl.%20Padma%20Legian%20Rama%20Garden%20Hotel,%20Legian%2080361%20Indonesia@-8.70627,115.16924" 
//   },
//   { 
//     name: "Take Japanese Restaurant", 
//     rating: 4.5, 
//     description: "Take Japanese Restaurant, established in 1999, delivers authentic Japanese dining with interiors inspired by bamboo. The menu features sushi, sashimi, robatayaki, noodles, and live seafood, crafted with premium Japanese imports and fresh local produce. Guests can complement their meals with sake, sochu, wine, or Japanese beer in a cozy setting.",
//     link: "https://maps.google.com/maps?saddr=&daddr=Jalan%20Patih%20Jelantik,%20Legian%20Indonesia@-8.709992,115.17538" 
//   },
//   { 
//     name: "Tenkai Japanese Nikkei Restaurant", 
//     rating: 4.9, 
//     description: "Tenkai Japanese Nikkei presents a unique fusion of Japanese and Peruvian flavors in an elegant space. The menu highlights ceviche, robata anticuchos, and sake misoyu, complemented by lively teppanyaki counters and premium sake or wine. Led by Chef Sandro Medrano, Tenkai offers a refined and memorable dining experience in Legian.",
//     link: "https://maps.google.com/maps?saddr=&daddr=Jl.%20Padma%20no.%201%20Padma%20Resort%20Bali,%20Legian%2080361%20Indonesia@-8.705,115.16602" 
//   }
// ];

export const baliMustTry = [
  {
    category: "Seafood By The Beach",
    description: "Experience the authentic Balinese seafood dining right on the beach. Fresh catch grilled to perfection while enjoying the ocean breeze and sunset views.",
    images: [
      { src: "/musttry/seafood.jpg", alt: "Seafood by The Beach" }
    ],
    items: [
      { 
        name: "Seafood Pantai Jimbaran", 
        link: "https://www.tripadvisor.co.id/Restaurants-g297696-c33-Jimbaran_South_Kuta_Bali.html",
        description: "A seafood dinner in Jimbaran is more than just a meal it's a memorable experience filled with delicious food, beautiful scenery, and a romantic atmosphere."
      },
      { 
        name: "Bawang Merah Beachfront Restaurant", 
        link: "https://www.tripadvisor.co.id/Restaurant_Review-g297696-d2366926-Reviews-Bawang_Merah_Beachfront_Restaurant-Jimbaran_South_Kuta_Bali.html",
        description: "Bawang Merah Beachfront Restaurant captivates diners with its stunning oceanfront setting, where sunset views and cultural shows enhance the dining experience."
      }
    ]
  },
  {
    category: "Nasi Tempong",
    description: "Discover the fiery taste of Nasi Tempong in Bali, a Javanese specialty of steamed rice, fresh vegetables, and spicy sambal that awakens every bite.",
    images: [
      { src: "/musttry/tempong.jpg", alt: "Nasi Tempong" }
    ],
    items: [
      { 
        name: "Nasi Tempong Indra", 
        link: "https://www.tripadvisor.com/Restaurant_Review-g297697-d6649811-Reviews-Nasi_Tempong_Indra-Kuta_Kuta_District_Bali.html",
        description: "Nasi Tempong Indra is a well-known eatery in Bali, popular for serving authentic Nasi Tempong, a traditional Banyuwangi (East Java) dish, and its legendary, extremely spicy sambal (chili paste)."
      },
      { 
        name: "Nasi Tempong Pink",
        link: "https://www.tripadvisor.com/Restaurant_Review-g297694-d3876489-Reviews-Warung_Pink_Tempong-Denpasar_Bali.html",
        description: "Nasi Tempong Pink Bali characterized by steamed rice served with a variety of fried or grilled side dishes like chicken, duck, or fish, plus vegetables, and a very spicy tempong chili sauce, served at a restaurant known for its all-pink decor."
      }
    ]
  },
  {
    category: "Nasi Campur Bali",
    description: "Savor the diverse flavors of Nasi Campur Bali, a traditional mixed rice dish featuring an array of side dishes that showcase the rich culinary heritage of Bali.",
    images: [
      { src: "/musttry/campur.jpg", alt: "Nasi Campur Bali" }
    ],
    items: [
      { name: "Nasi Ayam Kedewatan Ibu Mangku", 
        link: "https://share.google/OqyxabpIHP9iR8vxf",
        description: "Nasi Ayam Kedewatan Ibu Mangku is a renowned Balinese restaurant famous for its traditional Nasi Ayam (chicken rice) dish, served with a variety of flavorful side dishes and sambal, offering an authentic taste of Balinese cuisine in a charming setting."},
      { name: "Nasi Pedas Bu Andika",
        link: "https://www.tripadvisor.co.id/Restaurant_Review-g297697-d3494411-Reviews-Nasi_Pedas_Ibu_Andika-Kuta_Kuta_District_Bali.html",
        description: "Nasi Pedas Bu Andika is a popular eatery in Bali known for its spicy Nasi Pedas (spicy rice) dish, which features steamed rice served with a variety of flavorful side dishes and a generous amount of spicy sambal, catering to those who love bold and fiery flavors."
      }
    ]
  },
  {
    category: "Babi Guling",
    description: "Indulge in the iconic Balinese Babi Guling, a succulent roast pork dish marinated with a blend of traditional spices, offering a flavorful and aromatic culinary experience.",
    images: [
      { src: "/musttry/guling.jpg", alt: "Babi Guling" }
    ],
    items: [
      { name: "Guling Sam - Sam Merekak", 
        link: "https://www.tripadvisor.co.id/Restaurant_Review-g1025508-d25307041-Reviews-Guling_Samsam_Merekak-Mengwi_Bali.html",
        description: "Guling Sam-Sam Merekak is a popular spot in Bali for authentic Babi Guling (suckling pig), known for its flavorful, crispy-skinned roast pork served with traditional Balinese sides, offering a true taste of local culinary heritage."
      },
      { name: "Karya Rebo", link: "https://www.tripadvisor.co.id/Restaurant_Review-g297696-d6844646-Reviews-Babi_Guling_Karya_Rebo-Jimbaran_South_Kuta_Bali.html",
        description: "Karya Rebo is a well-known restaurant in Bali specializing in Babi Guling, offering a delicious and authentic Balinese dining experience with its perfectly roasted suckling pig and traditional accompaniments."
      },
      { name: "Pak Malen", link: "https://www.tripadvisor.co.id/Restaurant_Review-g469404-d2629908-Reviews-Warung_Babi_Guling_Pak_Malen-Seminyak_Kuta_District_Bali.html",
        description: "Pak Malen is a famous eatery in Bali renowned for its Babi Guling, serving tender and flavorful roast pork with a variety of traditional Balinese side dishes, making it a must-visit for food lovers."
      }
    ]
  },
  {
    category: "Japanese Restaurant",
    description: "Experience the art of Japanese cuisine in Bali, where traditional flavors meet fresh ingredients in a variety of sushi, sashimi, and other authentic dishes.",
    images: [
      { src: "/musttry/japanese.jpg", alt: "Japanese Restaurant" }    
    ],
    items: [
      { name: "Tenkai Japanese Nikkei Restaurant @ Padma Resort", 
        link: "https://www.padmahotels.com/padma-resort-legian/dining/tenkai-japanese-nikkei-restaurant/",
        description: "Tenkai Japanese Nikkei Restaurant @ Padma Resort is a popular Japanese restaurant in Bali known for its authentic sushi, sashimi, and other traditional dishes, offering a cozy ambiance and fresh ingredients that provide a genuine taste of Japan."
      },
      { name: "Philadelphia Sushi", 
        link: "https://philadelphiabali.com/",
        description: "Philadelphia Sushi is a well-known Japanese restaurant in Bali, famous for its creative sushi rolls and fresh sashimi, providing a delightful dining experience for sushi lovers."
      }
    ]
  },
  {
    category: "Coffee",
    description: "Discover Bali's vibrant coffee culture, where traditional brewing methods meet modern flavors, offering a rich and aromatic experience for coffee enthusiasts.",
    images: [
      { src: "/musttry/stuja.jpeg", alt: "Bali Coffee" }
    ],
    items: [
      { name: "Revolver", link: "https://revolverbali.com/",
        description: "Revolver is a trendy coffee shop in Bali known for its expertly brewed coffee and stylish interior, making it a popular spot for both locals and tourists."
      },
      { name: "Stuja di Pantai", link: "https://stuja.id/",
        description: "Stuja di Pantai is a beachfront café in Bali offering a relaxed atmosphere and a variety of coffee drinks, perfect for enjoying the ocean view."
      },
      { name: "Gigi Susu", link: "https://www.tripadvisor.co.id/Restaurant_Review-g311298-d28121252-Reviews-Gigi_Susu-Canggu_North_Kuta_Bali.html",
        description: "Gigi Susu is a charming coffee shop in Bali known for its unique drinks and cozy ambiance, providing a great spot for coffee lovers to unwind."
      }
    ]
  },
  {
    category: "SPA",
    description: "Relax and rejuvenate with Bali's world-renowned spa experiences, offering traditional treatments and modern wellness therapies in serene settings.",
    images: [
      { src: "/musttry/spa.jpg", alt: "Bali Spa" }    
    ],
    items: [
      { name: "Taman Air",
        link: "https://www.tripadvisor.co.id/Attraction_Review-g297697-d3308119-Reviews-Taman_Air_Spa_Self_Pampering-Kuta_Kuta_District_Bali.html",
        description: "Taman Air is a luxurious spa in Bali offering traditional Balinese treatments and modern wellness therapies in a tranquil setting, perfect for relaxation and rejuvenation."
      },
      { name: "Tea Tree", 
        link: "https://www.tripadvisor.co.id/Attraction_Review-g297697-d9874043-Reviews-Tea_Tree_Spa_Baruna_Bali-Kuta_Kuta_District_Bali.html",
        description: "Tea Tree is a popular spa in Bali known for its natural and organic treatments, providing a serene environment for relaxation and rejuvenation."
      }
    ]
  },
  {
    category: "Beach Club",
    description: "Experience the ultimate beach club vibes in Bali, where sun, sea, and stylish settings come together for unforgettable days of relaxation and fun.",
    images: [
      { src: "/musttry/beachclub.jpg", alt: "Bali Beach Club" }
    ],
    items: [
      { name: "Atlas Beach Club", link: "https://atlasbeachfest.com/beach-club",
        description: "Spread across 2.9 hectares of coastal paradise, Atlas is the biggest beach club in the world. Providing an immersive island experience and delicate service - all while offering world-class entertainment and events, as well as daily authentic cultural performances. Diversity thrives in every corner by consistently celebrating the local and global traditions."
      },
      { name: "Finns Beach Club", link: "https://finnsbeachclub.com/",
        description: "Finns Beach Club is a premier adults-only beach club located in Canggu, Bali, known for its multiple pools, bars, restaurants, and daily entertainment, including DJ sets and live music. Situated on Berawa Beach, the venue offers oceanfront views, with food, drinks, and non-stop entertainment from day to night."
      },
      { name: "La Planca", link: "https://laplancha-bali.com/",
        description: "Being the first beach bar of Chiringuito style in Bali with Spanish vintage craft, colourful bean bags and bright traditional Balinese umbrellas."
      }     
    ]
  },
  {
    category: "Fun Activity",
    description: "Explore exciting activities in Bali, from cultural experiences to adventurous outings, ensuring memorable moments during your stay.",
    images: [
      { src: "/musttry/kecak.jpg", alt: "Bali Fun Activity" }    
    ],
    items: [
      { name: "Water Boom", link: "https://www.waterbom-bali.com/",
        description: "First opened on the island of Bali almost 32 years ago, in 1993, Waterbom Bali is a boutique, botanical waterpark experience, nestled in the heart of Kuta. The park was built with the aim to create a space that provides visitors a memorable and fun experience, while also respecting the natural world around us. Thus, Waterbom Bali was consciously developed to complement the existing environment, with over 50% of the area’s local greenery being conserved, and all the slides and features of the park built around the existing flora and fauna, rather than over it."
      },
      { name: "Melukat", link: "https://palm-living.com/melukat-ritual-for-cleaning-and-purifying-our-body-mind-and-soul/",
        description: "Melukat is a traditional Balinese Ritual for cleaning and purifying our body, mind, and soul. This purification ceremony provides a unique cultural experience for visitors."
      },
      { name: "Pertunjukan Tari Kecak", link: "https://uluwatukecak.com/",
        description: "Pertunjukan Tari Kecak is a captivating Balinese dance performance, showcasing the island's rich cultural heritage."
      }
    ]
  },
  {
    category: "Shopping",
    description: "Discover unique shopping experiences in Bali, from traditional markets to modern boutiques, offering a variety of local crafts and international brands.",
    images: [
      { src: "/musttry/shopping.jpg", alt: "Bali Shopping" }    
    ],
    items: [
      { name: "The Keranjang", link: "https://www.tripadvisor.co.id/Attraction_Review-g297697-d17663370-Reviews-The_Keranjang_Bali-Kuta_Kuta_District_Bali.html",
        description: "The Keranjang is a unique shopping destination in Bali, offering a curated selection of local crafts, fashion, and homeware."
      },
      { name: "Krisna", link: "https://www.tripadvisor.co.id/Attraction_Review-g297694-d6589584-Reviews-Krisna_Bali-Denpasar_Bali.html",
        description: "Krisna is a popular shopping spot in Bali, known for its wide range of affordable souvenirs, clothing, and Balinese handicrafts."
      }
    ]
  }
];
