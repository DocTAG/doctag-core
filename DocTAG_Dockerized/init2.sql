--This file contains the sql queries to create the types and the tables of groundtruthdb
-- Database: doctag_db
--DROP DATABASE doctag_db;

CREATE DATABASE doctag_db WITH OWNER = postgres ENCODING = 'UTF8' TABLESPACE = pg_default CONNECTION LIMIT = -1;
	
	
--DROP SCHEMA public CASCADE;
GRANT ALL PRIVILEGES ON DATABASE doctag_db TO postgres;
\connect doctag_db;
--CREATE SCHEMA public;

-- DROP ELEMENTS--
-- DROP TYPE public.usecases;
-- DROP TYPE public.sem_area;
-- DROP TYPE public.gtypes;
-- DROP TYPE public.languages;
-- DROP TYPE public.profile;
-- DROP TABLE public."topic_has_document";
-- DROP TABLE public.annotation_label;
-- DROP TABLE public.associate;
-- DROP TABLE public.belong_to;
-- DROP TABLE public.concept;
-- DROP TABLE public.contains;
-- DROP TABLE public.ground_truth_log_file;
-- DROP TABLE public.linked;
-- DROP TABLE public.mention;
-- DROP TABLE public.report;
-- DROP TABLE public.semantic_area;
-- DROP TABLE public.use_case;
-- DROP TABLE public."user";

-- END DROP --

-- DEFINITION TYPES --


CREATE TYPE public.gtypes AS ENUM
    ('concepts', 'mentions', 'labels', 'concept-mention');

CREATE TYPE public.profile AS ENUM
    ('Admin', 'Tech', 'Expert', 'Beginner');

CREATE TYPE public.ns_names AS ENUM
    ('Robot', 'Human');


-- END TYPES --	
-- TABLES --


CREATE TABLE public.semantic_area
(
    name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT semantic_area_pkey PRIMARY KEY (name)
)

TABLESPACE pg_default;

ALTER TABLE public.semantic_area
    OWNER to postgres;

COPY public.semantic_area (name) FROM stdin;
default_area
\.

CREATE TABLE public.use_case
(
    name text COLLATE pg_catalog."default" NOT NULL,
    title text COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    narrative text COLLATE pg_catalog."default",
    CONSTRAINT use_case_pkey PRIMARY KEY (name)
)

TABLESPACE pg_default;

ALTER TABLE public.use_case
    OWNER to postgres;




CREATE TABLE public.report
(
    id_report character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    report_json jsonb NOT NULL,
    language text COLLATE pg_catalog."default" NOT NULL,
    institute text COLLATE pg_catalog."default" NOT NULL,
    batch integer,
    insertion_date date,
    CONSTRAINT report_pkey PRIMARY KEY (id_report, language)
)

TABLESPACE pg_default;

ALTER TABLE public.report
    OWNER to postgres;
 


CREATE TABLE public.name_space
(
    ns_id ns_names NOT NULL,
    description text COLLATE pg_catalog."default",
    CONSTRAINT name_space_pkey PRIMARY KEY (ns_id)
)

TABLESPACE pg_default;

ALTER TABLE public.name_space
    OWNER to postgres;

COPY public.name_space (ns_id) FROM stdin;
Human
Robot
\.


CREATE TABLE public."user"
(
    username character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    ns_id ns_names NOT NULL,
    password character varying(32) COLLATE pg_catalog."default" NOT NULL,
    profile profile NOT NULL,
    CONSTRAINT user_pkey PRIMARY KEY (username, ns_id),
    CONSTRAINT name_space_fkey FOREIGN KEY (ns_id)
        REFERENCES public.name_space (ns_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public."user"
    OWNER to postgres;

COPY public."user" (username, password, profile, ns_id) FROM stdin;
Test	0cbc6611f5540bd0809a388dc95a615b	Tech	Human
Test	0cbc6611f5540bd0809a388dc95a615b	Tech	Robot
Robot_user	5f61a0e9a11ce3a22225b34aa250da2f	Tech	Robot
\.

CREATE TABLE public.concept
(
    concept_url text COLLATE pg_catalog."default" NOT NULL,
    name character varying(1000) COLLATE pg_catalog."default",
    json_concept jsonb,
    CONSTRAINT concept_pkey PRIMARY KEY (concept_url)
)

TABLESPACE pg_default;

ALTER TABLE public.concept
    OWNER to postgres;



CREATE TABLE public.annotation_label
(
    seq_number integer NOT NULL,
    label text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT annotation_label_pkey PRIMARY KEY (label, seq_number)
)

TABLESPACE pg_default;

ALTER TABLE public.annotation_label
    OWNER to postgres;




CREATE TABLE public.mention
(
    mention_text text COLLATE pg_catalog."default",
    start integer NOT NULL,
    stop integer NOT NULL,
    id_report character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    language text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT mention_pkey PRIMARY KEY (id_report, language, start, stop),
    CONSTRAINT mention_id_report_language_fkey FOREIGN KEY (id_report, language)
        REFERENCES public.report (id_report, language) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public.mention
    OWNER to postgres;


CREATE TABLE public.topic_has_document
(
    name text COLLATE pg_catalog."default" NOT NULL,
    id_report character varying COLLATE pg_catalog."default" NOT NULL,
    language text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT topic_has_dcument_pkey PRIMARY KEY (name, id_report, language),
    CONSTRAINT report_fkey FOREIGN KEY (language, id_report)
        REFERENCES public.report (language, id_report) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT topic_fkey FOREIGN KEY (name)
        REFERENCES public.use_case (name) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public.topic_has_document
    OWNER to postgres;

CREATE TABLE public.ground_truth_log_file
(
    insertion_time timestamp with time zone NOT NULL,
    id_report character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    username character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    ns_id ns_names NOT NULL,
    gt_type gtypes NOT NULL,
    gt_json jsonb NOT NULL,
    language text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT ground_truth_log_file_pkey PRIMARY KEY (id_report, insertion_time, username, ns_id, language, name),
    CONSTRAINT ground_truth_log_file_id_report_language_fkey FOREIGN KEY (id_report, language)
        REFERENCES public.report (id_report, language) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT topic_fkey FOREIGN KEY (name)
        REFERENCES public.use_case (name) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT username_fkey FOREIGN KEY (ns_id, username)
        REFERENCES public."user" (ns_id, username) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public.ground_truth_log_file
    OWNER to postgres;


CREATE TABLE public.linked
(
    name text COLLATE pg_catalog."default" NOT NULL,
    username character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    ns_id ns_names NOT NULL,
    concept_url text COLLATE pg_catalog."default" NOT NULL,
    start integer NOT NULL,
    stop integer NOT NULL,
    id_report character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    insertion_time timestamp with time zone,
    language text COLLATE pg_catalog."default" NOT NULL,
    topic_name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT linked_pkey PRIMARY KEY (name, username, ns_id, concept_url, stop, start, id_report, language, topic_name),
    CONSTRAINT concept_url_fkey FOREIGN KEY (concept_url)
        REFERENCES public.concept (concept_url) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT mention_fkey FOREIGN KEY (start, language, id_report, stop)
        REFERENCES public.mention (start, language, id_report, stop) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT name_fkey FOREIGN KEY (name)
        REFERENCES public.semantic_area (name) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT topic_fkey FOREIGN KEY (topic_name)
        REFERENCES public.use_case (name) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT username_fkey FOREIGN KEY (ns_id, username)
        REFERENCES public."user" (ns_id, username) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public.linked
    OWNER to postgres;


CREATE TABLE public.contains
(
    insertion_time timestamp with time zone,
    concept_url text COLLATE pg_catalog."default" NOT NULL,
    id_report character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    username character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    ns_id ns_names NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    language text COLLATE pg_catalog."default" NOT NULL,
    topic_name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT contains_pkey PRIMARY KEY (concept_url, id_report, username, ns_id, name, topic_name, language),
    CONSTRAINT concept_url_fkey FOREIGN KEY (concept_url)
        REFERENCES public.concept (concept_url) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT contains_id_report_language_fkey FOREIGN KEY (id_report, language)
        REFERENCES public.report (id_report, language) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT name_fkey FOREIGN KEY (name)
        REFERENCES public.semantic_area (name) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT topic_fkey FOREIGN KEY (topic_name)
        REFERENCES public.use_case (name) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT username_fkey FOREIGN KEY (ns_id, username)
        REFERENCES public."user" (ns_id, username) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public.contains
    OWNER to postgres;



CREATE TABLE public.annotate
(
    insertion_time timestamp with time zone,
    username character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    ns_id ns_names NOT NULL,
    start integer NOT NULL,
    stop integer NOT NULL,
    id_report character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    language text COLLATE pg_catalog."default" NOT NULL,
    label character varying COLLATE pg_catalog."default" NOT NULL,
    seq_number integer NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT annotate_pkey PRIMARY KEY (username, ns_id, start, stop, id_report, language, label, seq_number, name),
    CONSTRAINT mention_fkey FOREIGN KEY (start, language, id_report, stop)
        REFERENCES public.mention (start, language, id_report, stop) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT topic_fkey FOREIGN KEY (name)
        REFERENCES public.use_case (name) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT user_fkey FOREIGN KEY (ns_id, username)
        REFERENCES public."user" (ns_id, username) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public.annotate
    OWNER to postgres;

CREATE TABLE public.associate
(
    id_report character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    username character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    ns_id ns_names NOT NULL,
    seq_number integer NOT NULL,
    label text COLLATE pg_catalog."default" NOT NULL,
    insertion_time timestamp with time zone,
    language text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT associate_pkey PRIMARY KEY (id_report, username, ns_id, seq_number, label, language, name),
    CONSTRAINT associate_id_report_language_fkey FOREIGN KEY (language, id_report)
        REFERENCES public.report (language, id_report) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT label_fkey FOREIGN KEY (label, seq_number)
        REFERENCES public.annotation_label (label, seq_number) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT topic_fkey FOREIGN KEY (name)
        REFERENCES public.use_case (name) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT username_fkey FOREIGN KEY (ns_id, username)
        REFERENCES public."user" (ns_id, username) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public.associate
    OWNER to postgres;

CREATE TABLE public.belong_to
(
    name text COLLATE pg_catalog."default" NOT NULL,
    concept_url text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT belong_to_pkey PRIMARY KEY (name, concept_url),
    CONSTRAINT concept_url_fkey FOREIGN KEY (concept_url)
        REFERENCES public.concept (concept_url) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT name_fkey FOREIGN KEY (name)
        REFERENCES public.semantic_area (name) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public.belong_to
    OWNER to postgres;


COPY public.report (id_report, report_json, language, institute, batch) FROM stdin;
FBIS3-10411	{"text": "<TEXT>Language: <F P=105> Spanish </F>Article Type:BFN   [Text] Santiago, 3 Mar (EFE) -- The Latin America and Caribbean countries are making progress toward the establishment of national authorities that will prevent the production, transportation, and trade of chemical weapons in the area.   The Chilean Ministry of Foreign Affairs today released the documents produced by the last regional seminar on this subject, which was held in Santiago last September.   The report stresses that each country must establish a national authority that will prohibit in their respective territories or in any place under their control the existence of chemical weapons, trade in elements for their manufacturing, or research to develop this kind of war materiel.   The documents point out that countries like Argentina, Cuba, Chile, Mexico, and Venezuela are concerned with preventing impediments to economic and technological development in the area, and with establishing solid bases for trade in chemical subtances not suitable for war use. ","document_id": "FBIS3-10411"}	english	default	1
FBIS3-10433	{"text": "<H5>  Photoelectrochemical Solar Cells To Go into Mass Production </H5>  Progress may have been made in the search for environmentally-friendly and cheap solar cells. Michael Graetzel of the Physical Chemistry Institute of the Federal Technical College in Lausanne has succeeded in developing dye-coated titanium dioxide elements which are far simpler to make than conventional silicon solar cells.   Graetzel told an international convention on solar and hydrogen technology in Freising a few weeks ago that the new solar cells are already being used in electronic bathroom scales. They are also used in solar-powered wrist watches, the material replacing the watch-glass. Although the output is only a few microwatts, it is quite sufficient for the watch mechanism.   The starting point for Graetzel's idea was photosynthesis, the photochemical principle used by plants to obtain energy from sunlight. Graetzel's ``photoelectrochemical'' cell uses a dye to capture light quanta like chlorophyll does in plants. Graetzel found titanium dioxide to be a semiconductor material which transmits the photon charge as electricity in the form of electrons; tests have shown it to be extremely stable.   The essential trick is to roughen the titanium dioxide coating to increase its surface area and thus the number of photons captured. In direct light the new solar cell currently achieves a 10 percent voltage efficiency. Graetzel believes the efficiency can be doubled in the next few years. By comparison, cells made from amorphous silicon, currently the cheapest material, reach an energy efficiency of only around 5 percent.   In diffuse light, where silicon cells provide hardly any power worth mentioning, the efficiency of the titanium dioxide element is now already around 18 percent. This is chiefly because the titanium dioxide's rough nanocrystalline surface is suited to the spectrum of diffuse (longer wavelength) light. This makes the new technology of interest for applications in our latitudes since the solar cell can provide electricity even with a cloudy sky.   Graetzel describes manufacture as relatively simple, requiring neither high temperatures, vacuum, nor nitrogen pressure chambers. Titanium dioxide can be applied to glass by screen printing. Titanium is also a common natural element, and titanium dioxide is nontoxic, unlike the semiconductors cadmium tellurite and copper indium diselenite, which are also used for solar cells.   Graetzel said that a Gelsenkirchen plate glass firm intends to make 100 watt solar modules. A pilot plant for mass production will be ready there in three years' time. The material is expected to cut the current high costs for solar modules to one tenth. ","document_id": "FBIS3-41663"}	english	default	1
FBIS3-10464	{"text": "[Text] Although Margaret Thatcher's upcoming visit to Chile was not on the agenda of two-day talks in Santiago between Argentine Vice Foreign Minister Fernando Petrella and his Chilean counterpart, Rodrigo Jesus Diaz Albonico, the quasi-official treatment that Thatcher will receive on her way to the Malvinas Islands reportedly aroused Argentine curiosity.   Invited by the Industrial Development Association (Sofofa) and the Center for Political Studies, Thatcher will be in Chile between 20 and 23 March.   Thatcher will hold a 45-minute news conference on her administration's economic performance. A (projected) audience of 500 people will contribute with sumptuous fees.   Thatcher, her husband, and a small entourage will first visit Brazil, where she will also hold a paid lecture, which seems already to be regular practice for successful former heads of government.   Petrella's visit, which will conclude today, had been prepared before the iron lady's visit to Chile was disclosed. Thatcher will visit Chile shortly after President Frei's inauguration on 11 March.   Some Argentine circles believe this event represents the Chilean Christian Democratic Party's leaning toward the British Conservative Party's iron hand. The British Conservative Party supports the islanders' unyielding position at a time when our diplomacy is conducting various actions concerning the century-old Malvinas Islands issue.   Although this does not seem to be entirely the case, there is a real bias: The official facilities for Thatcher's visit to the Malvinas Islands. Nevertheless, based on pragmatism, the Foreign Ministry is minimizing her visit.   Experts say: in the old days, the political willingness of government officials guided economic cooperation. Nowadays it is the other way around.   Trade with Chile was over $1 billion in 1993 (with a small surplus for Chile), not counting the $200 to $400 million contributed by tourism. After Japan and the EEC, Argentina is Chile's number three partner. Chile has invested $1 billion in Argentina. Why, then, these annoyed attitudes?   We don't know if Petrella, at his level and with interlocutors who are ending their tenure, managed to make his interlocutors understand the Argentine surprise.   What Argentine diplomatic circles do actually trust in is the equilibrium that Carlos Figueroa, Frei's foreign minister, has demonstrated during his outstanding performance as Chilean ambassador to Argentina; and in Diaz Albonico, who, along with current Interior Minister Enrique Krauss and Edmundo Vargas, the current Chilean ambassador to Argentina, are included on a list of three candidates to occupy the embassy on Tagle Street.   Distrustful people associate Thatcher's visit to Chile and the Malvinas Islands with the possibility of counteracting the participation of four Malvinas Islands personalities, including the tourism director, in a conference sponsored by CARI [Argentine Council for International Relations] in Mendoza to review an improvement of the situation. ","document_id": "FBIS3-10464"}	english	default	1
FBIS3-41656	{"text": " [Excerpt] [passage omitted] In the light of satellite surveys, experts from the German Aerospace Research Institute (DLR) in Oberpfaffenhofen, near Munich, believe that passenger aircraft have given rise to a half-percent extension in cloudage. However, the effect that this has on temperature is not known. Thin ice clouds bring about warming, whereas thick clouds cause cooling; which effect predominates is not known. <H5>  Raising Profits by Using Less Fuel </H5>  Meanwhile, engineers are seeking ``new aircraft engine designs that will consume 10 to 20 percent less kerosine and discharge up to 80 percent less nitrogen oxide,'' says Jost Schmidt, head of Munich- based MTU's development division. Fuel still accounts for about a third of an aircarft's overall running costs, and a 2-percent cut in running costs would double an airline's annual profits. Moreover, there are countries that levy an environment duty: For instance, the Swedish government has for four years been levying an emission- dependent tax on civil aircraft landing at Swedish airports.   There is a large market waiting for the engine builders: Experts put sales over the next 10 years at $120 billion in the civil sector alone. However, the cost of a research program to develop a new type of engine is put at $1-2 billion, an investment that the experts say would take about 15 years to amortize.   Four years ago, Pratt &amp; Whitney, FiatAvio, and MTU formed a joint venture to build the advanced ducted propulsion (ADP) proposed by Pratt &amp; Whitney engineers and prepare it for testing. The project is linked to an experimental and engineering program for future propulsion systems subsidized by the Research Ministry in Bonn, which has already poured a total of 100 million German marks into the project.   A test proptype of this new engine successfully underwent initial trials on a test bench in Florida just under a year ago, and special functions, such as the reverse thrust, have just been tested in a NASA wind tunnel in California.   ADP is based partially on conventional principles but operates with greater efficiency than current engines. The engineers have achieved this result by substantially raising what is known as the by-pass ratio. Part of the air normally flows through the inner core area, while the rest flows past it on the outside, providing the desired propulsion. The drawback inherent in raising this by- pass ratio is that it increases engine diameter by about 50 percent. If the advantage of lower fuel consumption is not to be canceled out by the weight gain, new materials must be developed that will be as light as possible while withstanding extreme loads. MTU is therefore undertaking research into fiber-reinforced composites about three times as light as titanium. The engineers are confident that ADP will be in use by the turn of the century.   An MTU idea known as CRISP (counter-rotating integrated shrouded propfan) goes a step further, having not the usual single rotor at the engine intake, but two rotating in opposite directions, thus increasing the air throughput. However, CRISP research is currently on the ``back burner'' for financial reasons. <H5>  Hydrogen Brings Problems </H5>  Last but not least, ``alternative'' fuels are still being fielded as a means of reducing exhaust emissions. Veritable miracles are being attributed to hydrogen in particular, although engines running on hydrogen discharge double the amount of water vapor emitted by a conventional engine and would thus increase cloud formation. Moreover, the assumption that an aircraft running on hydrogen would discharge nothing but water vapor is false.   NASA research showed 20 years ago that at high combustion temperatures nitrogen oxidizes out of air to form nitrogen oxides. Discharges of these gases cannot actually be reduced by introducing alternative fuels: New, more efficient combustion chambers would be required even in this case. Creating them would entail exploring virgin territory in engineering, because the hydrogen has to be cooled to below minus 252 degrees Celsius in the tanks, with the risk that components might ice up or become brittle. Moreover, energy content for energy content, hydrogen is four times more voluminous than kerosine, so additional tanks would inevitably have to be incorporated. ","document_id": "FBIS3-41656"}	english	default	1
FBIS3-41663	{"text": "<H5>  Photoelectrochemical Solar Cells To Go into Mass Production </H5>  Progress may have been made in the search for environmentally-friendly and cheap solar cells. Michael Graetzel of the Physical Chemistry Institute of the Federal Technical College in Lausanne has succeeded in developing dye-coated titanium dioxide elements which are far simpler to make than conventional silicon solar cells.   Graetzel told an international convention on solar and hydrogen technology in Freising a few weeks ago that the new solar cells are already being used in electronic bathroom scales. They are also used in solar-powered wrist watches, the material replacing the watch-glass. Although the output is only a few microwatts, it is quite sufficient for the watch mechanism.   The starting point for Graetzel's idea was photosynthesis, the photochemical principle used by plants to obtain energy from sunlight. Graetzel's ``photoelectrochemical'' cell uses a dye to capture light quanta like chlorophyll does in plants. Graetzel found titanium dioxide to be a semiconductor material which transmits the photon charge as electricity in the form of electrons; tests have shown it to be extremely stable.   The essential trick is to roughen the titanium dioxide coating to increase its surface area and thus the number of photons captured. In direct light the new solar cell currently achieves a 10 percent voltage efficiency. Graetzel believes the efficiency can be doubled in the next few years. By comparison, cells made from amorphous silicon, currently the cheapest material, reach an energy efficiency of only around 5 percent.   In diffuse light, where silicon cells provide hardly any power worth mentioning, the efficiency of the titanium dioxide element is now already around 18 percent. This is chiefly because the titanium dioxide's rough nanocrystalline surface is suited to the spectrum of diffuse (longer wavelength) light. This makes the new technology of interest for applications in our latitudes since the solar cell can provide electricity even with a cloudy sky.   Graetzel describes manufacture as relatively simple, requiring neither high temperatures, vacuum, nor nitrogen pressure chambers. Titanium dioxide can be applied to glass by screen printing. Titanium is also a common natural element, and titanium dioxide is nontoxic, unlike the semiconductors cadmium tellurite and copper indium diselenite, which are also used for solar cells.   Graetzel said that a Gelsenkirchen plate glass firm intends to make 100 watt solar modules. A pilot plant for mass production will be ready there in three years' time. The material is expected to cut the current high costs for solar modules to one tenth. ","document_id": "FBIS3-41663"}	english	default	1
FBIS3-41666	{"text": "<H5>  Foreword </H5>  The state of the environment in the Russian Federation in 1992 remained unsatisfactory in general. The intense pollution of the environment by the gaseous, liquid, and solid waste of production and consumption continued. The slump in production did not bring about a comparable reduction in pollution, because enterprises began economizing on environmental protection expenditures under these critical conditions. The state of our economy is still having an adverse effect on the state of our environment.   The ecological catastrophe is not a threat to our country alone, however. The economic activities of human beings and their effects on nature have increased to such proportions that they have turned the problem of protecting the biosphere into a planetary or global concern. Without any fear of exaggeration, we can say that the survival of the human race will depend on its ability to solve this problem.   Only a comprehensive approach to environmental problems can promote the more effective protection and intelligent use of ecosystems, the guarantee of a safe future, and the harmonization of man's relationship with nature. No country is capable of doing this alone. This can only be done through concerted effort--on the basis of a global partnership for the sake of sustainable development. Development is sustainable if it does not disrupt the necessary conditions--social, economic, and ecological--for its continuation, reproducing without depleting its own basis.   These issues were discussed at the UN Conference on Environment and Development in Rio de Janeiro (Brazil) from 3 to 14 June 1992. Several documents were approved at the conference, including the Declaration on Environment and Development, which announced the fundamental principles of sustainable development.   These principles lie at the basis of the new Russian state ecological policy.   The principal objective of state ecological policy is the development of a new legal and economic mechanism to regulate the environmental effects of economic activity. This mechanism would secure the inclusion of environmental requirements as essential elements of the procedure for assessing economic decisions, comprehensive and sectorial (in terms of different types of resources) licenses for resource use, the implementation of the principle ``Let the polluter pay,'' penalties, and the use of natural resources and ecosystems without depleting them.   Reforms resulting from the pursuit of state ecological policy will consist in the following:   -- the improvement of environmental protection laws and the group of environmental restrictions and regulations governing the use of resources for their adaptation to the conditions of the more liberal economy and denationalized property;   -- a gradual move toward international standards in technological processes and products, creating the necessary conditions for Russia's inclusion in the world economy and the international system of environmental security;   -- the unification of existing territorial departmental systems for the observation and monitoring of natural resources and elements of the environment under a common set of procedural and organizational guidelines;   -- economic incentives in state tax, credit, and pricing policy for the conservation of resources and energy and the incorporation of equipment and technology meeting ecological requirements;   -- ecological appraisals and environmental impact studies of the results of all programs and projects related to economic and other activity and rigorous oversight of compliance with the requirements of environmental impact reports;   -- the creation of a market for environmental projects and the development of entrepreneurship in this field.   All of this is indisputably necessary, but it is not enough to prevent environmental catastrophe. New scientific research will be needed for a more constructive analysis of the nature and implications of potential adverse ecological consequences of economic activity and for the guarantee of ecological security. In addition, there is no question that the ecological situation can only be stabilized and improved by means of changes in the focus of the Russian Federation's socioeconomic development, the establishment of new values and moral principles, and the reconsideration of consumption patterns and the goals, priorities, and methods of human activity.   [Signed] V.I. Danilov-Danilyan, Russian Federation minister of environmental protection and natural resources <H6>  Contents </H6><H5>  Introduction </H5>  Section 1. Environmental Quality and the State of Natural Resources   1.1. Climatic Distinctions of the Year   1.2. Air Quality and Protection. The Earth's Ozone Layer   1.3. Water Resources and Their Quality, Protection, and Use   1.4. Land Resources and Their Quality, Protection, and Use   1.5. Mineral Use and the Protection of Mineral Resources   1.6. Forests and Their Use, Reproduction, and Protection   1.7. Flora and Fauna and Their Present State, Use, and Protection   1.8. Fish Resources and Their Present State, Use, Protection, and Reproduction   1.9. Radioactive Pollution of the Environment   1.10. Noise and Electromagnetic Influences   1.11. Environmental Pollution by Highly Hazardous Substances   1.12. Biological Pollution   Section 2. Natural Territories Under Special Protection   2.1. State Nature Preserves, National Parks, Sanctuaries, Natural Monuments, and Natural Museums   2.2. Health Resorts and Therapeutic Treatment Zones   2.3. Ethnic Territories   Section 3. Environmental Effects of Economic Complexes   3.1. Fuel and Energy Complex   3.2. Metallurgical Complex   3.3. Chemical and Petrochemical Complex   3.4. Timber and Wood Chemical Industry   3.5. Machine-Building Complex   3.6. Construction Complex   3.7. Transport and Highway Complex   3.8. Armed Forces and Defense Industry   3.9. Agroindustrial Complex   3.10. Public Utilities   3.11. Production and Consumption Waste   Section 4. Regional and Interstate Ecological Problems   4.1. State of the Environment in Russia's Economic Regions, Republics, Krays and Oblasts   4.2. State of Large Regions With Unsatisfactory Ecological Conditions   4.3. Interstate Ecological Problems   4.4. Ecological Conditions in Large Cities and Industrial Centers   4.5. Effects of Ecological Factors on Public Health   Section 5. Industrial Accidents, Natural Emergencies, and Their Ecological Consequences and Prevention   5.1. Accidents   5.2. Natural Emergencies   Section 6. Government Regulation of Resource Use and Environmental Protection   6.1. Environmental Laws and Penalties for Violations   6.2. Government Ecological Programs and Their Implementation   6.3. Fundamental Standards and Procedures   6.4. Network of Government Bodies Regulating and Monitoring Resource Use and Their Activities   6.5. Economic Measures   6.6. State Environmental Impact Studies   6.7. Environmental Monitoring   6.8. Environmental Security System   Section 7. Science and Technology in the Resolution of Environmental Problems   7.1. Scientific-Technical Development Projects   7.2. Incorporation of Progressive Equipment and Technology   Section 8. International Cooperation   Section 9. Ecological Instruction, Training, and Educational Information Projects. Public Ecological Movement   9.1. Educational Information Projects   9.2. Ecological Training and Instruction   9.3. Public Ecological Movement <H5>  Summary </H5>  1. Conclusions   2. Forecasts and Recommendations <H5>  Addendum </H5><H6>  Introduction </H6>  The state of the environment in the Russian Federation in 1992 was influenced considerably by general economic processes in the country.   These processes displayed extremely contradictory development and were influenced by the following factors: the collapse of the political and economic-administrative structures of the former USSR; the existence of long-term negative trends dating back to the time when the Russian economy was still part of the Union; the effects of new economic processes engendered by radical economic reform.   The collapse of the USSR diminished the actual chances of solving ecological problems on the interstate level and in Russia itself. The disruption of ties between republics had an adverse effect on the production of resource-conserving equipment, reagents for the treatment of waste liquids and gases, and other products needed for environmental protection. Difficulties arose in solving inter-republic ecological problems caused by the rising level of the Caspian Sea, the need to protect and reproduce the supply of water in coastal and trans-border aquifers, the transfer of pollutants through the atmosphere, and others.   The long-term negative tendencies with the most adverse effects on the state of the environment are the structural irregularities in the Russian economy, reflected in the excessive development of resource-intensive, frequently ``dirty'' fields of production, the general technological underdevelopment of industry, agriculture, and construction, the high concentration of production units in some regions, and the underdeveloped infrastructure.   In the course of radical reform, Russia encountered new processes connected with the destabilization of the financial system, the insolvency of enterprises, and the soaring rate of inflation, which did much to cause the slump in production and investment activity. This, in turn, had a negative effect on conservation measures.   In 1992 the volume of industrial production in the national economy as a whole was 18.8 percent* below the 1991 figure, including decreases of 26.8 percent* in nonferrous metallurgy and 22.2 percent* in the chemical industry. The substantial reduction of output, however, did not result in a comparable reduction of environmental pollution. According to the Russian State Committee for Statistics, atmospheric emissions within the territory of Russia decreased by only 11 percent* in 1992, and the reduction in releases of polluted sewage was negligible.   Relative indicators of change in the volumes of products and services in different regions of the country and indicators of emissions and the dumping of pollutants per product cost unit are presented in figures 1-5. ","document_id": "FBIS3-41666"}	english	default	1
\.

COPY public.annotation_label (seq_number, label) FROM stdin;
1	Relevant
2	Not Relevant
3	Partially Relevant
\.

COPY public.use_case (name, title, description, narrative) FROM stdin;
351	Falkland petroleum exploration	What information is available on petroleum exploration in the South Atlantic near the Falkland Islands?	Any document discussing petroleum exploration in the South Atlantic near the Falkland Islands is considered relevant.  Documents discussing petroleum exploration in continental South America are not relevant.
375	hydrogen energy	What is the status of research on hydrogen as a feasible energy source?	A relevant document will describe progress in research on controlled hydrogen fusion or the use of hydrogen as fuel to power engines.
\.


COPY public.topic_has_document (id_report, name, language) FROM stdin;
FBIS3-10411	351	english
FBIS3-10433	351	english
FBIS3-10464	351	english
FBIS3-41656	375	english
FBIS3-41663	375	english
FBIS3-41666	375	english
\.