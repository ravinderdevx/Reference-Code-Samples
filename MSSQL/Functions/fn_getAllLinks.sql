-- FUNCTION: public."FN_GetAllChildAbuseLink"(integer, integer, text, text, text, integer, text)

-- DROP FUNCTION public."FN_GetAllChildAbuseLink"(integer, integer, text, text, text, integer, text);

CREATE OR REPLACE FUNCTION public.FN_GetAllChildAbuseLink(
	"PageNo" integer,
	"PageSize" integer,
	"SortColumn" text,
	"SortOrder" text,
	"Email" text,
	"ChildAbuseLinkId" integer,
	"DateTime" text)
    RETURNS json
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 0
AS $BODY$
DECLARE
 lPageNbr   integer=$1;
 lPageSize  integer=$2;
 lFirstRec  integer= ( $1 - 1 ) * $2;
 lLastRec   integer=( $1 * $2 + 1 );
 jsonData Json;
Begin
WITH CTE_Results
    AS (
  select ROW_NUMBER() OVER (
      ORDER BY
    	CASE WHEN ($3 = 'Email' AND $4 ='ASC')
                    THEN U."Email"
        END ASC,
        CASE WHEN ($3 = 'Email' AND $4='DESC')
                   THEN U."Email"
       END DESC,
        CASE WHEN ($3 = 'ChildAbuseLinkId' AND $4 ='ASC')
                    THEN CAL."ChildAbuseLinkId"
        END ASC,
        CASE WHEN ($3 = 'ChildAbuseLinkId' AND $4='DESC')
                   THEN CAL."ChildAbuseLinkId"
        END DESC,
      CASE WHEN ($3 = 'DateTime' AND $4 ='ASC')
                    THEN CAL."DateTime"
        END ASC,
        CASE WHEN ($3 = 'DateTime' AND $4='DESC')
                   THEN CAL."DateTime"
       END DESC
  ) as RowNum,
       CAL."ChildAbuseLinkId", 
       CAL."parentfilename",
       CAL."ControllerId", 
       CAL."DateTime", 
       I."image_url" as facefilepath,
       U."Email"
	FROM public."ChildAbuseLinks" as CAL 
    join public."images" as I on CAL."parentfilename" = I."image_name" 
    join public."Users" as U on CAL."ControllerId" = U."UserId"
    where CAL."Active" = 'Y'
      AND ($5 = '' OR U."Email" LIKE CONCAT('%',$5,'%'))
	  AND ( CASE WHEN ($6 > 0) THEN CAL."ChildAbuseLinkId" = $6 WHEN ($6 = 0) THEN CAL."ChildAbuseLinkId" > 0  END )  
      AND ($7 = '' OR date(CAL."DateTime")::text =  $7 )
--      Order by CAL."DateTime" Desc  
       )  	
    Select row_to_json(R) into jsonData FROM ( 
    SELECT (select array_to_json(array_agg(t.*)) as resultData
	from (   
    SELECT
       CPC."ChildAbuseLinkId", 
       CPC."parentfilename",
       CPC."ControllerId", 
       CPC."DateTime",
       CPC."facefilepath",
       CPC."Email"
    FROM CTE_Results AS CPC
    WHERE 
    ROWNUM > lFirstRec 
    AND ROWNUM < lLastRec
   Order by RowNum asc
    ) t), (SELECT COUNT(*) as totalCount  FROM CTE_Results )) R;
    return jsonData;
    End

$BODY$;

ALTER FUNCTION public."FN_GetAllChildAbuseLink"(integer, integer, text, text, text, integer, text)
    OWNER TO postgres;

