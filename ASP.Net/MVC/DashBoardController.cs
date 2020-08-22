using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using QuizSoftware.Models.Custom;

namespace QuizSoftware.Controllers
{
    public class DashBoardController : Controller
    {
        // GET: DashBoard
        public ActionResult dashview()
        {
            return View();
        }

        public JsonResult FinalResult()
        {
            using (Context db = new Context())
            {
                //var all = from Q in db.QuestionTables join O in db.optionTables on Q.QuestionID equals O.QuestionID into group1 from g1 in group1.DefaultIfEmpty() select new { Q.QuestionID, Q.ActualQuestion, g1.AnswerID, g1.Answer, g1.AnswerWeightage };
                var all = from F in db.FinalResultTables join L in db.leads on F.UserID equals L.UserID where F.Active == true select new { F.ID, F.TotalMarks, F.Resultget, L.UserName };
                return new JsonResult { Data = all.ToList(), JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
        public void DeleteFinalRecord(int id)
        {
            using (Context db = new Context())
            {
                var FinalResultlist = db.FinalResultTables.Where(x => x.ID == id).FirstOrDefault();
                FinalResultlist.Active = false;
                FinalResultlist.ModifyBy = User.Identity.Name;
                FinalResultlist.ModifyDate = DateTime.Now;
                db.SaveChanges();
            }
        }
        public JsonResult HistoryResult()
        {
            using (Context db = new Context())
            {
                //var all = from Q in db.QuestionTables join O in db.optionTables on Q.QuestionID equals O.QuestionID into group1 from g1 in group1.DefaultIfEmpty() select new { Q.QuestionID, Q.ActualQuestion, g1.AnswerID, g1.Answer, g1.AnswerWeightage };
                var all = from H in db.UserHistoryTables join L in db.leads on H.UserID equals L.UserID select new { L.UserName, H.OptionSelected, H.MarksGet, H.ID, question = db.QuestionTables.Where(x => x.QuestionID == H.QuestionID).FirstOrDefault() };
                return new JsonResult { Data = all.ToList(), JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
        public JsonResult conditionTable()
        {
            using (Context db = new Context())
            {
                //var all = from Q in db.QuestionTables join O in db.optionTables on Q.QuestionID equals O.QuestionID into group1 from g1 in group1.DefaultIfEmpty() select new { Q.QuestionID, Q.ActualQuestion, g1.AnswerID, g1.Answer, g1.AnswerWeightage };
                var all = db.ResultTables.ToList();
                return new JsonResult { Data = all, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
        public JsonResult QuestionList()
        {
            using (Context db = new Context())
            {
                //var all = from Q in db.QuestionTables join O in db.optionTables on Q.QuestionID equals O.QuestionID into group1 from g1 in group1.DefaultIfEmpty() select new { Q.QuestionID, Q.ActualQuestion, g1.AnswerID, g1.Answer, g1.AnswerWeightage };
                var all = from O in db.optionTables join Q in db.QuestionTables on O.QuestionID equals Q.QuestionID select new { Q.QuestionID, O.Answer, O.AnswerWeightage, O.AnswerID, question = db.QuestionTables.Where(x => x.QuestionID == Q.QuestionID).Select(x => x.ActualQuestion).FirstOrDefault() };
                return new JsonResult { Data = all.ToList(), JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }
        }
    }
}