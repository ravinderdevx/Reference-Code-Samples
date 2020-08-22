<?php
class Pagination {

	function getPaginationLinks($limit, $count,$href) {
		$output = '';
		if(!isset($_GET["page"])) $_GET["page"] = 1;
		if($limit != 0)
			$pages  = ceil($count/$limit);

		if($pages>1) {
			if($_GET["page"] == 1) 
				$output = $output . '<span class="link first disabled">First</span><span class="link disabled">Prev</span>';
			else	
				$output = $output . '<a class="link first" href="' . $href . 1 . '" >First</a><a class="link"  href="' . $href . ($_GET["page"]-1) . '" >Prev</a>';
			
			if(($_GET["page"]-3)>0) {
				if($_GET["page"] == 1)
					$output = $output . '<span id=1 class="link current pageNumber">1</span>';
				else				
					$output = $output . '<a class="link pageNumber" href="' . $href . 1 . '" >1</a>';
			}
			if(($_GET["page"]-3)>1) {
					$output = $output . '<span class="dot pageNumber">...</span>';
			}
			
			for($i=($_GET["page"]-2); $i<=($_GET["page"]+2); $i++)	{
			if($i<1) continue;
				if($i>$pages) break;
				if($_GET["page"] == $i)
					$output = $output . '<span id='.$i.' class="link current pageNumber">'.$i.'</span>';
				else				
					$output = $output . '<a class="link pageNumber" href="' . $href . $i.'" >'.$i.'</a>';
			}
			
		if(($pages-($_GET["page"]+2))>1) {
				$output = $output . '<span class="dot pageNumber">...</span>';
			}
			if(($pages-($_GET["page"]+2))>0) {
				if($_GET["page"] == $pages)
					$output = $output . '<span id=' . ($pages) .' class="link current pageNumber">' . ($pages) .'</span>';
				else				
					$output = $output . '<a class="link pageNumber" href="' . $href  .  ($pages) .'" >' . ($pages) .'</a>';
			}
			
			if($_GET["page"] < $pages)
			$output = $output . '<a  class="link" href="' . $href  . ($_GET["page"]+1) . '" >Next</a><a  class="link" href="' . $href . ($pages) . '" >Last</a>';
			else				
				$output = $output . '<span class="link disabled">Next</span><span class="link disabled">Last</span>';
			
			
		}
		return $output;
	}

	function getAjaxPaginationLinks($perpage, $count,$href) {
		$output = '';
		if(!isset($_GET["page"])) $_GET["page"] = 1;
		if($perpage != 0)
			$pages  = ceil($count/$perpage);
		if($pages>1) {
			if($_GET["page"] == 1) 
				$output = $output . '<span class="link first disabled">First</span><span class="link disabled">Prev</span>';
			else	
				$output = $output . '<a class="link first" onclick="getresult(\'' . $href . (1) . '\')" >First</a><a class="link" onclick="getresult(\'' . $href . ($_GET["page"]-1) . '\')" >Prev</a>';
			
			
			if(($_GET["page"]-3)>0) {
				if($_GET["page"] == 1)
					$output = $output . '<span id=1 class="link current">1</span>';
				else				
					$output = $output . '<a class="link" onclick="getresult(\'' . $href . '1\')" >1</a>';
			}
			if(($_GET["page"]-3)>1) {
					$output = $output . '<span class="dot">...</span>';
			}
			
			for($i=($_GET["page"]-2); $i<=($_GET["page"]+2); $i++)	{
				if($i<1) continue;
				if($i>$pages) break;
				if($_GET["page"] == $i)
					$output = $output . '<span id='.$i.' class="link current">'.$i.'</span>';
				else				
					$output = $output . '<a class="link" onclick="getresult(\'' . $href . $i . '\')" >'.$i.'</a>';
			}
			
			if(($pages-($_GET["page"]+2))>1) {
				$output = $output . '<span class="dot">...</span>';
			}
			if(($pages-($_GET["page"]+2))>0) {
				if($_GET["page"] == $pages)
					$output = $output . '<span id=' . ($pages) .' class="link current">' . ($pages) .'</span>';
				else				
					$output = $output . '<a class="link" onclick="getresult(\'' . $href .  ($pages) .'\')" >' . ($pages) .'</a>';
			}
			
			if($_GET["page"] < $pages)
				$output = $output . '<a  class="link" onclick="getresult(\'' . $href . ($_GET["page"]+1) . '\')" >Next</a><a  class="link" onclick="getresult(\'' . $href . ($pages) . '\')" >Last</a>';
			else				
				$output = $output . '<span class="link disabled">Next</span><span class="link disabled">Last</span>';
			
			
		}
		return $output;
	}

	function getPrevNext($perpage,$count,$href) {
		$output = '';
		if(!isset($_GET["page"])) $_GET["page"] = 1;
		if($perpage != 0)
			$pages  = ceil($count/$perpage);
		if($pages>1) {
			if($_GET["page"] == $pages) 
				$output = $output . '<span class="btn btn-blue link disabled first prev">Prev</span>';
			else	
				$output = $output . '<a class="btn btn-blue link first prev" onclick="getresult(\'' . $href . ($_GET["page"]+1) . '\')" >Prev</a>';			
			
			if($_GET["page"] > 1)
				$output = $output . '<a  class="btn btn-blue link next" onclick="getresult(\'' . $href . ($_GET["page"]-1) . '\')" >Next</a>';
			else				
				$output = $output . '<span class="btn btn-blue link next disabled">Next</span>';
			
			
		}
		return $output;
	}
}
?>