--completitudinea
select * 
from   modbd_centralizat.oltp_judet
minus
(select * from JUDET_BUCURESTI
union all
select * from JUDET_PROVINCIE@bd_provincie);

--reconstructia 
--a inclus in b
select * 
from   modbd_centralizat.oltp_judet 
minus
(select * from JUDET_BUCURESTI
union all
select * from judet_provincie@bd_provincie);

-- b inclus in a
(select * from JUDET_BUCURESTI
union all
select * from JUDET_PROVINCIE@bd_provincie)
minus
select * 
from   modbd_centralizat.oltp_judet;

--disjunctia
select * from JUDET_BUCURESTI
intersect
select * from JUDET_PROVINCIE@bd_provincie;


-- LOCALITATE
--completitudine
select * 
from   modbd_centralizat.OLTP_LOCALITATE
minus
(select * from LOCALITATE_BUCURESTI
union all
select * from LOCALITATE_PROVINCIE@bd_provincie);

--reconstructia 
--a inclus in b
select * 
from   modbd_centralizat.OLTP_LOCALITATE 
minus
(select * from LOCALITATE_BUCURESTI
union all
select * from LOCALITATE_PROVINCIE@bd_provincie);

-- b inclus in a
(select * from LOCALITATE_BUCURESTI
union all
select * from LOCALITATE_PROVINCIE@bd_provincie)
minus
select * 
from   modbd_centralizat.OLTP_LOCALITATE;

--disjunctia
select * from LOCALITATE_BUCURESTI
intersect
select * from LOCALITATE_PROVINCIE@bd_provincie;