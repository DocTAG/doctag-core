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
    description text COLLATE pg_catalog."default" NOT NULL,
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


