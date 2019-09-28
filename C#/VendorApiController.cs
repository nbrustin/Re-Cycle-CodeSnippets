using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Vendor;
using Sabio.Models.Requests.Vendors;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/vendors")]
    [ApiController]
    public class VendorApiController : BaseApiController
    {
        private IVendorService _service = null;
        private IAuthenticationService<int> _authService = null;

        public VendorApiController(IVendorService service
            , ILogger<VendorApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(VendorAddRequest model)
        {
            ObjectResult result = null;
            int userId = _authService.GetCurrentUserId();

            try
            {
                int id = _service.Add(model, userId);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }
            return result;

        }

        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<int>> Update(VendorUpdateRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;
            int userId = _authService.GetCurrentUserId();

            try
            {
                _service.Update(model, userId);
                response = new SuccessResponse();
            }

            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("{id:int}"), AllowAnonymous]
        public ActionResult<ItemResponse<Vendor>> Get(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Vendor vendor = _service.Get(id);

                if(vendor == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource Not Found");
                }
                else
                {
                    response = new ItemResponse<Vendor> { Item = vendor };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("paginate"), AllowAnonymous]
        public ActionResult<ItemResponse<Paged<Vendor>>> Get(int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                Paged<Vendor> paged = _service.Get(pageIndex, pageSize);
                if(paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records not found"));
                }
                else
                {
                    ItemResponse<Paged<Vendor>> response = new ItemResponse<Paged<Vendor>>();

                    response.Item = paged;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }

        [HttpGet("current")]
        public ActionResult<ItemResponse<Paged<Vendor>>> GetByCurrent()
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                int authUserId = _authService.GetCurrentUserId();
                Vendor vendor = _service.GetByCurrent(authUserId);

                if(vendor == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Vendor not found.");
                }
                else
                {
                    response = new ItemResponse<Vendor> { Item = vendor };
                }
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpPut("{id:int}/{isActive:int}")]
        public ActionResult<SuccessResponse> UpdateStatus(int id, int isActive)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.UpdateStatus(id, isActive);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

    }
}

