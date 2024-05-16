using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class FallbackController : Controller
{
    // return the UI app
    public ActionResult Index()
    {
        return PhysicalFile(
            Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "index.html"
            ),
            "text/HTML"
        );
    }
}
