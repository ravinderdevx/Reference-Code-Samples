-- FUNCTION: public."FN_GetUserDetailForSearchInvoked"()

-- DROP FUNCTION public."FN_GetUserDetailForSearchInvoked"();

CREATE OR REPLACE FUNCTION public.FN_GetUserDetailForSearchInvoked(
	)
    RETURNS json
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 0
AS $BODY$
Declare
JsonData json;
BEGIN
select array_to_json(array_agg(X.*)) into JsonData from(
select SU."id" as "UserId",SU."email" as "Email" , SU."enabled" as "Enabled", UD."PackageId" as PackageId,
PK."SearchAllowed" as "SearchAllowed" , PK."Type" as "PackageType",
UB."id" as "UserBiometericId", HR."id" as "HitrecordId",HR."datetime" as "HitrecordDateTime"
from public."system_user" as SU
join public."UserDetails" as UD on UD."UserId" = SU."id"
join public."Packages" as PK on PK."PackageId" = UD."PackageId"
join public."userbiometrics" as UB on UB."email" = SU."email"
Left join public."hitrecords" as HR on HR."userbiometrics_id" = UB."id"
where SU."enabled" = '1' and UD."Active"='Y' and PK."Type" = 'FR' 
and ((PK."SearchAllowed" = 1 and HR."datetime" is null) 
     or
     (PK."SearchAllowed" = 4 and ((date_part('year',age(CURRENT_TIMESTAMP,HR."datetime"))= 0 and
    date_part('month',age(CURRENT_TIMESTAMP,HR."datetime")) = 0 and
    date_part('day',age(CURRENT_TIMESTAMP,HR."datetime")) = 7 ) or HR."datetime" is null))
     or
     (PK."SearchAllowed" = 30 and  ((date_part('year',age(CURRENT_TIMESTAMP,HR."datetime"))= 0 and
    date_part('month',age(CURRENT_TIMESTAMP,HR."datetime")) = 0 and
    date_part('day',age(CURRENT_TIMESTAMP,HR."datetime")) = 1) or HR."datetime" is null))
    )) X;

return JsonData;
END

$BODY$;

ALTER FUNCTION public."FN_GetUserDetailForSearchInvoked"()
    OWNER TO postgres;

