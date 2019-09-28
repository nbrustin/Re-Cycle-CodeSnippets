using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Discount;
using Sabio.Models.Requests.Discounts;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/discounts")]
    [ApiController]
    public class DiscountApiController : BaseApiController
    {
        private IDiscountService _service = null;
        private IAuthenticationService<int> _authService = null;

        public DiscountApiController(IDiscountService service
            , ILogger<DiscountApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(DiscountAddRequest model)
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
        public ActionResult<ItemResponse<int>> Update(DiscountUpdateRequest model)
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
        public ActionResult<ItemResponse<Discount>> Get(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Discount discount = _service.Get(id);

                if (discount == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource Not Found");
                }
                else
                {
                    response = new ItemResponse<Discount> { Item = discount };
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
        public ActionResult<ItemResponse<Discount>> Get(int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                Paged<Discount> paged = _service.Get(pageIndex, pageSize);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records not found"));
                }
                else
                {
                    ItemResponse<Paged<Discount>> response = new ItemResponse<Paged<Discount>>();

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
        public ActionResult<ItemResponse<Paged<Discount>>> GetByCurrent(int pageIndex, int pageSize)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                int authUserId = _authService.GetCurrentUserId();
                Paged<Discount> pagedDiscount = _service.Get(pageIndex, pageSize, authUserId);

                if (pagedDiscount == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Discount not found");
                }
                else
                {
                    response = new ItemResponse<Paged<Discount>> { Item = pagedDiscount };
                }
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("verify/{productId:int}")]
        public ActionResult<ItemResponse<VerifiedDiscount>> Search(int productId, string q)
        {
            ActionResult result = null;
            try
            {
                VerifiedDiscount discount = _service.GetVerifiedDiscount(productId, q);
                if (discount == null)
                {
                    result = NotFound404(new ErrorResponse("Discount not found"));
                }
                else
                {
                    ItemResponse<VerifiedDiscount> response = new ItemResponse<VerifiedDiscount>();
                    response.Item = discount;
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

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                _service.Delete(id);
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
    }
}