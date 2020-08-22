-- FUNCTION: public."FN_GetUserSearchFaces"(integer, integer)

-- DROP FUNCTION public."FN_GetUserSearchFaces"(integer, integer);

CREATE OR REPLACE FUNCTION public.FN_GetUserSearchFaces(
	"HitRecordId" integer,
	"PageNumber" integer)
    RETURNS json
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 0
AS $BODY$
Declare 
roffset integer = 0;
rlimit integer = 16;
results json;
totalCount integer;
jsonData json;
localpath text;
livepath text;
Begin
--roffset = ($2 - 1)* rlimit;

select "Url" into localpath  FROM public."SiteUrl" WHERE "Name" = 'LOCAL_IMAGES_URL';
select "Url" into livepath  FROM public."SiteUrl" WHERE "Name" = 'LIVE_IMAGES_URL';

Select array_to_json(array_agg(y.*)) into results from ( SELECT mfb.id as ResultId, mfb.parentfilename, 
mfb."tags",
STRING_AGG(tg."TagName", ', ') as tagsString,
                                                        CASE 
WHEN b."NewFilePath" is not null 
THEN replace(replace(b."NewFilePath",localpath,livepath ),E'\\','/')
ELSE replace(replace(mfb.facefilepath,localpath,livepath ),E'\\','/') 
END as replace
FROM  hitrecords h 
left join (SELECT unnest(resultidlist)::integer AS ResultId,id FROM hitrecords HI where id=$1) x on h.id= x.id 
join multiplefacebiometrics mfb on x.ResultId = mfb.id
LEFT JOIN public."Blurred" b On b."PreviousId" = mfb."id"  
LEFT JOIN public."Tags" tg ON tg."TagId" = ANY(mfb."tags"::int[])
where h.id = $1 GROUP BY mfb.id, b."NewFilePath" limit 200) y;
--Limit rlimit offset roffset
SELECT count(distinct mfb.id) into totalCount FROM  hitrecords h 
left join (SELECT unnest(resultidlist)::integer AS ResultId,id FROM hitrecords HI where id=$1) x on h.id= x.id 
join multiplefacebiometrics mfb on x.ResultId = mfb.id  
LEFT JOIN public."Tags" tg ON tg."TagId" = ANY(mfb."tags"::int[])
where h.id = $1 limit 200;
                                                                                                                                
Select row_to_json(R) into jsonData FROM ( 
    select  Results, TotalCount
) R;

return jsonData;
End

$BODY$;

ALTER FUNCTION public."FN_GetUserSearchFaces"(integer, integer)
    OWNER TO postgres;

