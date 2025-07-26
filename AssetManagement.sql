--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-26 08:50:37

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4883 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 870 (class 1247 OID 24584)
-- Name: enum_assets_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_assets_status AS ENUM (
    'Active',
    'In Maintenance',
    'Retired'
);


ALTER TYPE public.enum_assets_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 24651)
-- Name: AssetIssue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AssetIssue" (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    asset_id integer NOT NULL,
    asset_category_id integer NOT NULL,
    issue_date date DEFAULT CURRENT_DATE,
    remarks text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);


ALTER TABLE public."AssetIssue" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24650)
-- Name: AssetIssue_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AssetIssue_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AssetIssue_id_seq" OWNER TO postgres;

--
-- TOC entry 4884 (class 0 OID 0)
-- Dependencies: 223
-- Name: AssetIssue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AssetIssue_id_seq" OWNED BY public."AssetIssue".id;


--
-- TOC entry 220 (class 1259 OID 16451)
-- Name: assetcategories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assetcategories (
    id integer NOT NULL,
    name character varying(255),
    description character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.assetcategories OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16450)
-- Name: assetcategories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assetcategories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assetcategories_id_seq OWNER TO postgres;

--
-- TOC entry 4885 (class 0 OID 0)
-- Dependencies: 219
-- Name: assetcategories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assetcategories_id_seq OWNED BY public.assetcategories.id;


--
-- TOC entry 232 (class 1259 OID 49174)
-- Name: assethistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assethistory (
    id integer NOT NULL,
    asset_name character varying(500),
    employee_name character varying(500),
    action_type character varying(50) NOT NULL,
    action_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    remarks text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.assethistory OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 49173)
-- Name: assethistory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assethistory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assethistory_id_seq OWNER TO postgres;

--
-- TOC entry 4886 (class 0 OID 0)
-- Dependencies: 231
-- Name: assethistory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assethistory_id_seq OWNED BY public.assethistory.id;


--
-- TOC entry 230 (class 1259 OID 32897)
-- Name: assetreturn; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assetreturn (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    asset_id integer NOT NULL,
    asset_category_id integer NOT NULL,
    return_date date DEFAULT CURRENT_DATE,
    return_reason text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);


ALTER TABLE public.assetreturn OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 32896)
-- Name: assetreturn_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assetreturn_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assetreturn_id_seq OWNER TO postgres;

--
-- TOC entry 4887 (class 0 OID 0)
-- Dependencies: 229
-- Name: assetreturn_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assetreturn_id_seq OWNED BY public.assetreturn.id;


--
-- TOC entry 222 (class 1259 OID 16462)
-- Name: assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assets (
    id integer NOT NULL,
    serial_number character varying(255) NOT NULL,
    make character varying(255),
    model character varying(255),
    purchase_date date,
    purchase_price numeric(10,2),
    status character varying(20) DEFAULT 'in_stock'::character varying,
    asset_type character varying(200),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_scrapped boolean DEFAULT false
);


ALTER TABLE public.assets OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16461)
-- Name: assets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assets_id_seq OWNER TO postgres;

--
-- TOC entry 4888 (class 0 OID 0)
-- Dependencies: 221
-- Name: assets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assets_id_seq OWNED BY public.assets.id;


--
-- TOC entry 228 (class 1259 OID 32880)
-- Name: assetscrap; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assetscrap (
    id integer NOT NULL,
    asset_id integer NOT NULL,
    scrap_date date DEFAULT CURRENT_DATE,
    scrap_reason character varying(100) NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);


ALTER TABLE public.assetscrap OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 32879)
-- Name: assetscrap_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assetscrap_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assetscrap_id_seq OWNER TO postgres;

--
-- TOC entry 4889 (class 0 OID 0)
-- Dependencies: 227
-- Name: assetscrap_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assetscrap_id_seq OWNED BY public.assetscrap.id;


--
-- TOC entry 226 (class 1259 OID 24677)
-- Name: branch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branch (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.branch OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 24676)
-- Name: branch_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.branch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.branch_id_seq OWNER TO postgres;

--
-- TOC entry 4890 (class 0 OID 0)
-- Dependencies: 225
-- Name: branch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.branch_id_seq OWNED BY public.branch.id;


--
-- TOC entry 218 (class 1259 OID 16431)
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    status character varying(255) NOT NULL,
    join_date date,
    leave_date date,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    branch_id integer
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16430)
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employees_id_seq OWNER TO postgres;

--
-- TOC entry 4891 (class 0 OID 0)
-- Dependencies: 217
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;


--
-- TOC entry 4685 (class 2604 OID 24654)
-- Name: AssetIssue id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AssetIssue" ALTER COLUMN id SET DEFAULT nextval('public."AssetIssue_id_seq"'::regclass);


--
-- TOC entry 4680 (class 2604 OID 16454)
-- Name: assetcategories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assetcategories ALTER COLUMN id SET DEFAULT nextval('public.assetcategories_id_seq'::regclass);


--
-- TOC entry 4695 (class 2604 OID 49177)
-- Name: assethistory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assethistory ALTER COLUMN id SET DEFAULT nextval('public.assethistory_id_seq'::regclass);


--
-- TOC entry 4692 (class 2604 OID 32900)
-- Name: assetreturn id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assetreturn ALTER COLUMN id SET DEFAULT nextval('public.assetreturn_id_seq'::regclass);


--
-- TOC entry 4681 (class 2604 OID 16465)
-- Name: assets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets ALTER COLUMN id SET DEFAULT nextval('public.assets_id_seq'::regclass);


--
-- TOC entry 4689 (class 2604 OID 32883)
-- Name: assetscrap id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assetscrap ALTER COLUMN id SET DEFAULT nextval('public.assetscrap_id_seq'::regclass);


--
-- TOC entry 4688 (class 2604 OID 24680)
-- Name: branch id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branch ALTER COLUMN id SET DEFAULT nextval('public.branch_id_seq'::regclass);


--
-- TOC entry 4679 (class 2604 OID 16434)
-- Name: employees id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- TOC entry 4869 (class 0 OID 24651)
-- Dependencies: 224
-- Data for Name: AssetIssue; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AssetIssue" (id, employee_id, asset_id, asset_category_id, issue_date, remarks, created_at, updated_at) FROM stdin;
1	113	9	1	2025-07-17	test	2025-07-23 10:30:06.058	\N
2	111	1	1	2025-07-23	test	2025-07-23 10:36:51.965	\N
3	113	1	17	2025-07-23	test	2025-07-23 10:40:34.225	\N
4	111	9	1	2025-07-23	test	2025-07-23 10:44:09.655	\N
5	111	9	1	2025-07-23	test	2025-07-23 10:44:56.163	\N
6	111	1	17	2025-07-23	test	2025-07-23 10:45:08.561	\N
7	111	1	17	2025-07-23	test	2025-07-23 10:45:49.286	\N
8	112	9	1	2025-07-23	test	2025-07-23 10:46:12.57	\N
9	112	9	1	2025-07-23	test	2025-07-23 10:47:25.428	\N
10	111	1	17	2025-07-23	testramya	2025-07-23 10:52:09.403	\N
11	112	1	1	2025-07-23	test	2025-07-23 10:54:46.716	\N
12	112	9	1	2025-07-23	123466	2025-07-23 10:56:37.334	\N
13	113	1	17	2025-07-23	52	2025-07-23 11:00:07.799	\N
14	112	9	17	2025-07-23	test	2025-07-23 11:00:23.193	\N
15	112	1	1	2025-07-23	12	2025-07-23 11:02:18.875	\N
16	111	9	1	2025-07-23	tes	2025-07-23 11:10:58.139	\N
17	112	1	17	2025-07-23	test	2025-07-23 11:14:23.405	\N
18	114	9	17	2025-07-25	test	2025-07-23 11:17:32.383	\N
19	111	1	17	2025-07-23	g	2025-07-23 11:18:41.98	\N
20	112	9	17	2025-07-31	test	2025-07-23 11:18:57.798	\N
21	112	9	17	2025-07-24	kczxiclsdj	2025-07-24 04:49:34.75	\N
22	113	11	17	2025-07-24	cjsnlmckm	2025-07-24 05:13:41.972	\N
23	122	12	17	2025-07-24	knxlk jclxzjv.n,czxhhsdlk	2025-07-24 05:13:59.278	\N
24	119	13	17	2025-07-25	testing	2025-07-25 06:35:34.092	\N
25	119	13	17	2025-07-25	testing	2025-07-25 06:35:48.884	\N
26	119	13	17	2025-07-25	testing	2025-07-25 06:38:33.296	\N
27	119	13	17	2025-07-25	testing	2025-07-25 06:38:37.491	\N
28	111	13	17	2025-07-25	testing	2025-07-25 06:40:19.339	\N
29	119	14	17	2025-07-25	use	2025-07-25 06:46:13.957	\N
30	111	14	1	2025-07-25	test	2025-07-25 07:08:13.655	\N
31	111	14	1	2025-07-25	test	2025-07-25 09:19:47.505	\N
32	111	14	1	2025-07-25	remarks	2025-07-25 09:23:20.107	\N
33	111	14	1	2025-07-25	remarks	2025-07-25 09:27:35.927	\N
34	111	14	1	2025-07-25	remarks	2025-07-25 09:33:04.954	\N
35	111	14	1	2025-07-25	remarks	2025-07-25 09:36:31.525	\N
36	111	14	1	2025-07-25	test	2025-07-25 09:36:52.024	\N
37	111	14	1	2025-07-26	remarks	2025-07-25 09:40:24.583	\N
38	111	14	1	2025-07-25	po	2025-07-25 09:41:59.261	\N
39	113	14	17	2025-07-25	tet	2025-07-25 09:44:31.171	\N
40	113	14	1	2025-07-25	remaks	2025-07-25 09:47:37.517	\N
41	111	14	17	2025-07-25	re	2025-07-25 09:50:44.109	\N
42	113	14	1	2025-07-25	remaraks	2025-07-25 10:44:52.783	\N
43	111	14	1	2025-07-25	remarks	2025-07-25 10:48:12.604	\N
44	111	15	1	2025-07-25	test	2025-07-25 10:48:59.23	\N
45	111	13	1	2025-07-25	purpose	2025-07-25 10:50:30.306	\N
46	111	14	1	2025-07-25	Remarkstest	2025-07-25 10:53:09.744	\N
47	111	13	1	2025-07-25	issue remarks	2025-07-25 10:58:15.512	\N
48	113	18	17	2025-07-25	ws	2025-07-25 17:30:57.344	\N
49	122	21	17	2025-07-25	sd	2025-07-25 17:39:44.383	\N
50	113	26	1	2025-07-25	sdf	2025-07-25 17:41:43.429	\N
\.


--
-- TOC entry 4865 (class 0 OID 16451)
-- Dependencies: 220
-- Data for Name: assetcategories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assetcategories (id, name, description, created_at, updated_at) FROM stdin;
1	Laptop	Portable computers	2025-07-20 09:53:32.091436+05:30	2025-07-20 09:53:32.091436+05:30
17	Mobile phones	Android based all version	2025-07-23 07:35:31.159+05:30	2025-07-23 07:35:31.292991+05:30
18	Drill Machines	All types 	2025-07-23 07:36:31.358+05:30	2025-07-23 07:36:31.477011+05:30
\.


--
-- TOC entry 4877 (class 0 OID 49174)
-- Dependencies: 232
-- Data for Name: assethistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assethistory (id, asset_name, employee_name, action_type, action_date, remarks, created_at, updated_at) FROM stdin;
1	18	113	Issued	2025-07-25 00:00:00	ws	2025-07-25 17:30:57.507	2025-07-25 17:30:57.507
2	SN20004 - Dell Inspiron 15	Michael Lee	Returned	2025-07-25 00:00:00	sds	2025-07-25 17:36:46.36	2025-07-25 17:36:46.36
3	SN10006 - Apple iPhone 13	Ramya	Issued	2025-07-25 00:00:00	sd	2025-07-25 17:39:44.417	2025-07-25 17:39:44.417
4	SN10006 - Apple iPhone 13	\N	scraped	2025-07-25 17:40:19.866	fsd	2025-07-25 17:40:19.867	2025-07-25 17:40:19.867
5	SN20001 - Apple iPhone 13	Michael Lee	Issued	2025-07-25 00:00:00	sdf	2025-07-25 17:41:43.463	2025-07-25 17:41:43.463
6	SN20001 - Apple iPhone 13	Michael Lee	Returned	2025-07-25 00:00:00	sdfs	2025-07-25 17:42:03.48	2025-07-25 17:42:03.48
7	SN20003 - Lenovo ThinkPad E14	\N	scraped	2025-07-25 17:44:21.483	fsd	2025-07-25 17:44:21.484	2025-07-25 17:44:21.484
\.


--
-- TOC entry 4875 (class 0 OID 32897)
-- Dependencies: 230
-- Data for Name: assetreturn; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assetreturn (id, employee_id, asset_id, asset_category_id, return_date, return_reason, created_at, updated_at) FROM stdin;
1	111	13	1	2025-07-25	\N	2025-07-25 09:52:21.351	\N
2	111	13	1	2025-07-25	\N	2025-07-25 10:50:04.277	\N
3	111	14	1	2025-07-25	\N	2025-07-25 10:52:47.195	\N
4	113	13	1	2025-07-25	\N	2025-07-25 10:57:45.048	\N
5	111	13	1	2025-07-25	\N	2025-07-25 11:48:57.24	\N
6	113	27	1	2025-07-25	\N	2025-07-25 17:33:18.537	\N
7	114	32	1	2025-07-25	\N	2025-07-25 17:34:29.068	\N
8	113	18	1	2025-07-25	\N	2025-07-25 17:35:33.953	\N
9	113	29	17	2025-07-25	\N	2025-07-25 17:36:46.309	\N
10	113	26	1	2025-07-25	\N	2025-07-25 17:42:03.376	\N
\.


--
-- TOC entry 4867 (class 0 OID 16462)
-- Dependencies: 222
-- Data for Name: assets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assets (id, serial_number, make, model, purchase_date, purchase_price, status, asset_type, created_at, is_scrapped) FROM stdin;
30	SN20005	HP	Pavilion x360	2024-05-25	64000.00	Available	Laptop	2025-07-25 20:46:09.092155	f
31	SN20006	Bosch	GBH 2-26 DRE	2024-06-01	12500.00	Available	Drill Machine	2025-07-25 20:46:09.092155	f
33	SN20008	Dewalt	D25133K	2024-06-18	11950.00	Available	Drill Machine	2025-07-25 20:46:09.092155	f
34	SN20009	OnePlus	11R 5G	2024-07-01	45000.00	Scraped	Mobile Phone	2025-07-25 20:46:09.092155	f
35	SN20010	Asus	ROG Zephyrus G14	2024-07-15	98000.00	Available	Laptop	2025-07-25 20:46:09.092155	f
27	SN20002	Samsung	Galaxy S22	2024-02-10	68000.00	Available	Mobile Phone	2025-07-25 20:46:09.092155	f
32	SN20007	Makita	DHR242Z	2024-06-10	13999.00	Available	Drill Machine	2025-07-25 20:46:09.092155	f
18	SN10003	Lenovo	ThinkPad X1 Carbon	2023-03-20	98000.00	Available	Laptop	2025-07-25 20:09:48.678664	f
29	SN20004	Dell	Inspiron 15	2024-04-20	58000.00	Available	Laptop	2025-07-25 20:46:09.092155	f
17	SN10002	HP	EliteBook 840 G8	2023-02-15	92000.00	Retired	Laptop	2025-07-25 20:09:48.678664	f
21	SN10006	Apple	iPhone 13	2023-06-18	70000.00	Retired	Mobile	2025-07-25 20:09:48.678664	f
26	SN20001	Apple	iPhone 13	2024-01-05	72000.00	Available	Mobile Phone	2025-07-25 20:46:09.092155	f
28	SN20003	Lenovo	ThinkPad E14	2024-03-15	62000.00	Retired	Laptop	2025-07-25 20:46:09.092155	f
15	KY432G	Realme	7 pro	2025-07-02	23445.56	Retired	Mobile Phone	2025-07-25 06:45:56.036	f
16	SN10001	Dell	Latitude 5420	2023-01-10	85000.00	Available	Laptop	2025-07-25 20:09:48.678664	f
22	SN10007	Samsung	Galaxy S21	2023-07-25	68000.00	Scraped	Mobile	2025-07-25 20:09:48.678664	f
\.


--
-- TOC entry 4873 (class 0 OID 32880)
-- Dependencies: 228
-- Data for Name: assetscrap; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assetscrap (id, asset_id, scrap_date, scrap_reason, notes, created_at, updated_at) FROM stdin;
1	1	2025-07-24	kkkasg	jdlckds	2025-07-24 05:37:39.566	\N
2	9	2025-07-24	kkkasg	mcdshsoijsifos	2025-07-24 05:57:06.724	\N
3	12	2025-07-24	Display dead	by mistake fall in water	2025-07-24 06:03:49.179	\N
4	11	2025-07-24	power button not working	Long time issue 	2025-07-24 06:09:13.186	\N
5	15	2025-07-25	scrap	tets	2025-07-25 10:59:22.854	\N
6	15	2025-07-25	scrap	tets	2025-07-25 10:59:27.136	\N
7	14	2025-07-25	scrap reason	notest	2025-07-25 11:00:58.381	\N
8	17	2025-07-25	sda	cx	2025-07-25 17:36:59.166	\N
9	17	2025-07-25	sda	cx	2025-07-25 17:37:04.791	\N
10	21	2025-07-25	fsd	dfd	2025-07-25 17:40:19.747	\N
11	28	2025-07-25	fsd	fsd	2025-07-25 17:44:21.447	\N
\.


--
-- TOC entry 4871 (class 0 OID 24677)
-- Dependencies: 226
-- Data for Name: branch; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.branch (id, name) FROM stdin;
1	Sales
2	Purchase
3	Service
4	Support
5	IT
6	HR
\.


--
-- TOC entry 4863 (class 0 OID 16431)
-- Dependencies: 218
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (id, name, email, status, join_date, leave_date, created_at, updated_at, branch_id) FROM stdin;
113	Michael Lee	michael.lee@example.com	active	2022-02-01	\N	2025-07-20 09:59:21.345678+05:30	2025-07-22 18:32:37.364582+05:30	1
114	Sophia Wilson	sophia.wilson@example.com	inactive	2017-10-12	2021-12-31	2025-07-20 10:00:01.234567+05:30	2025-07-22 18:32:37.364582+05:30	1
116	Olivia Martinez	olivia.martinez@example.com	active	2019-09-15	\N	2025-07-20 10:02:22.345612+05:30	2025-07-22 18:32:37.364582+05:30	2
119	Jane Smith	jane.smith@example.com	inactive	2025-07-01	2025-07-01	2025-07-22 21:03:30.283+05:30	2025-07-22 21:03:30.283+05:30	2
122	Ramya	r@gmail.com	active	2025-08-02	2025-07-24	2025-07-22 21:04:58.471+05:30	2025-07-22 21:04:58.472+05:30	2
127	Meera Patel	meera.patel@example.com	Active	2022-12-01	\N	2025-07-25 19:56:49.513977+05:30	2025-07-25 19:56:49.513977+05:30	1
128	Rahul Verma	rahul.verma@example.com	Resigned	2021-03-20	2023-06-10	2025-07-25 19:56:49.513977+05:30	2025-07-25 19:56:49.513977+05:30	2
129	Priya Nair	priya.nair@example.com	Active	2022-06-25	\N	2025-07-25 19:56:49.513977+05:30	2025-07-25 19:56:49.513977+05:30	1
130	Amit Mehra	amit.mehra@example.com	Active	2023-08-10	\N	2025-07-25 19:56:49.513977+05:30	2025-07-25 19:56:49.513977+05:30	2
131	Divya Reddy	divya.reddy@example.com	Active	2023-04-18	\N	2025-07-25 19:56:49.513977+05:30	2025-07-25 19:56:49.513977+05:30	1
132	Siddharth Roy	siddharth.roy@example.com	Active	2021-11-05	\N	2025-07-25 19:56:49.513977+05:30	2025-07-25 19:56:49.513977+05:30	2
138	Rahul Verma	rahul.verma@example.com	Resigned	2021-03-20	2023-06-10	2025-07-25 19:56:56.032826+05:30	2025-07-25 19:56:56.032826+05:30	2
143	Neha Joshi	neha.joshi@example.com	Resigned	2020-07-15	2022-09-01	2025-07-25 19:56:56.032826+05:30	2025-07-25 19:56:56.032826+05:30	1
144	Karan Malhotra	karan.malhotra@example.com	Active	2022-10-30	\N	2025-07-25 19:56:56.032826+05:30	2025-07-25 19:56:56.032826+05:30	2
145	Sneha Iyer	sneha.iyer@example.com	Active	2023-02-12	\N	2025-07-25 19:56:56.032826+05:30	2025-07-25 19:56:56.032826+05:30	1
\.


--
-- TOC entry 4892 (class 0 OID 0)
-- Dependencies: 223
-- Name: AssetIssue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AssetIssue_id_seq"', 50, true);


--
-- TOC entry 4893 (class 0 OID 0)
-- Dependencies: 219
-- Name: assetcategories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assetcategories_id_seq', 19, true);


--
-- TOC entry 4894 (class 0 OID 0)
-- Dependencies: 231
-- Name: assethistory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assethistory_id_seq', 7, true);


--
-- TOC entry 4895 (class 0 OID 0)
-- Dependencies: 229
-- Name: assetreturn_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assetreturn_id_seq', 10, true);


--
-- TOC entry 4896 (class 0 OID 0)
-- Dependencies: 221
-- Name: assets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assets_id_seq', 35, true);


--
-- TOC entry 4897 (class 0 OID 0)
-- Dependencies: 227
-- Name: assetscrap_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assetscrap_id_seq', 11, true);


--
-- TOC entry 4898 (class 0 OID 0)
-- Dependencies: 225
-- Name: branch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.branch_id_seq', 6, true);


--
-- TOC entry 4899 (class 0 OID 0)
-- Dependencies: 217
-- Name: employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employees_id_seq', 145, true);


--
-- TOC entry 4708 (class 2606 OID 24660)
-- Name: AssetIssue AssetIssue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AssetIssue"
    ADD CONSTRAINT "AssetIssue_pkey" PRIMARY KEY (id);


--
-- TOC entry 4702 (class 2606 OID 16460)
-- Name: assetcategories assetcategories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assetcategories
    ADD CONSTRAINT assetcategories_pkey PRIMARY KEY (id);


--
-- TOC entry 4716 (class 2606 OID 49184)
-- Name: assethistory assethistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assethistory
    ADD CONSTRAINT assethistory_pkey PRIMARY KEY (id);


--
-- TOC entry 4714 (class 2606 OID 32906)
-- Name: assetreturn assetreturn_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assetreturn
    ADD CONSTRAINT assetreturn_pkey PRIMARY KEY (id);


--
-- TOC entry 4704 (class 2606 OID 16473)
-- Name: assets assets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_pkey PRIMARY KEY (id);


--
-- TOC entry 4706 (class 2606 OID 16475)
-- Name: assets assets_serial_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_serial_number_key UNIQUE (serial_number);


--
-- TOC entry 4712 (class 2606 OID 32889)
-- Name: assetscrap assetscrap_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assetscrap
    ADD CONSTRAINT assetscrap_pkey PRIMARY KEY (id);


--
-- TOC entry 4710 (class 2606 OID 24682)
-- Name: branch branch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branch
    ADD CONSTRAINT branch_pkey PRIMARY KEY (id);


--
-- TOC entry 4700 (class 2606 OID 24628)
-- Name: employees id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT id PRIMARY KEY (id);


-- Completed on 2025-07-26 08:50:37

--
-- PostgreSQL database dump complete
--

