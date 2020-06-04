create table public.proyecto(
	id serial NOT NULL primary key,
	nombre text not null
);


create table public.tendencia(
	id serial  NOT NULL primary key,
	proyecto integer REFERENCES proyecto(id) ON DELETE CASCADE,
	tendencia text not null,
	descripcion text not null
);

create table public.hashtags(
	id serial not null primary key,
	descripcion text not null
);

CREATE TABLE public.fase1
(
  fecha timestamp without time zone NOT NULL DEFAULT now(),
  textjson text NOT NULL,
  CONSTRAINT fase1_pkey PRIMARY KEY (fecha)
);


CREATE TABLE public.municipios
(
  id serial NOT NULL primary key,
  objectid text,
  shape text,
  cod_pais text,
  pais text,
  cod_depto text,
  departamento text,
  departamen_1 text,
  municipio text,
  municipi_1 text,
  codigo text,
  orig_fid text,
  point_x text,
  point_y text
);

CREATE TABLE public.necesidad
(
  id serial NOT NULL primary key
  descripcion text NOT NULL
);


CREATE TABLE public.cubo1
(
  municipio numeric NOT NULL,
  necesidad numeric NOT NULL,
  mes text,
  ano text,
  contador numeric
);


