using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Discount;
using Sabio.Models.Requests.Discounts;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Sabio.Services
{
    public class DiscountService : IDiscountService
    {
        private IDataProvider _data = null;

        public DiscountService(IDataProvider data)
        {
            _data = data;
        }

        public int Add(DiscountAddRequest model, int userId)
        {
            int id = 0;

            _data.ExecuteNonQuery("dbo.Discounts_Insert",
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddParams(model, col);
                    col.AddWithValue("@CreatedBy", userId);

                    SqlParameter idOut = new SqlParameter("@Id", System.Data.SqlDbType.Int);
                    idOut.Direction = System.Data.ParameterDirection.Output;

                    col.Add(idOut);
                },
                returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;

                    Int32.TryParse(oId.ToString(), out id);
                });
            return id;
        }

        public void Update(DiscountUpdateRequest model, int userId)
        {
            _data.ExecuteNonQuery("dbo.Discounts_Update",
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddParams(model, col);
                    col.AddWithValue("@Id", model.Id);
                    col.AddWithValue("@ModifiedBy", userId);
                });
        }

        public Discount Get(int id)
        {
            Discount discount = null;

            _data.ExecuteCmd("dbo.Discounts_SelectById", delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                discount = DiscountMapper(reader);
            }
            );
            return discount;
        }

        public Paged<Discount> Get(int pageIndex, int pageSize)
        {
            Paged<Discount> pagedResult = null;
            List<Discount> result = null;
            int totalCount = 0;

            _data.ExecuteCmd("dbo.Discounts_SelectAll", inputParamMapper: delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@PageIndex", pageIndex);
                parameterCollection.AddWithValue("@PageSize", pageSize);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                Discount model = DiscountMapper(reader);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(13);
                }

                if (result == null)
                {
                    result = new List<Discount>();
                }

                result.Add(model);
            }
            );
            if (result != null)
            {
                pagedResult = new Paged<Discount>(result, pageIndex, pageSize, totalCount);
            }
            return pagedResult;
        }

        public Paged<Discount> Get(int pageIndex, int pageSize, int createdBy)
        {
            Paged<Discount> pagedList = null;
            List<Discount> list = null;
            int totalCount = 0;

            _data.ExecuteCmd("dbo.Discounts_Select_ByCreatedBy_Products", delegate (SqlParameterCollection paramcollection)
            {
                paramcollection.AddWithValue("@PageIndex", pageIndex);
                paramcollection.AddWithValue("@PageSize", pageSize);
                paramcollection.AddWithValue("@CreatedBy", createdBy);
            }, (reader, recordSetIndex) =>
            {
                Discount discount = DiscountMapper(reader);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(17);
                }

                if (list == null)
                {
                    list = new List<Discount>();
                }

                list.Add(discount);
            });

            if (list != null)
            {
                pagedList = new Paged<Discount>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public VerifiedDiscount GetVerifiedDiscount(int productId, string q)
        {
            VerifiedDiscount discount = null;


            _data.ExecuteCmd(
                "dbo.Discounts_Get_Verified",
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@Query", q);
                    parameterCollection.AddWithValue("@ProductId", productId);

                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    discount = new VerifiedDiscount();
                    discount.ProductId = reader.GetSafeInt32(0);
                    discount.Percentage = reader.GetSafeDecimal(1);
                }
            );
            return discount;
        }

        public void Delete(int id)
        {
            _data.ExecuteNonQuery("dbo.Discounts_DeleteById", inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            });
        }

        private static void AddParams(DiscountAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@ProductId", model.ProductId);
            col.AddWithValue("@CouponCode", model.CouponCode);
            col.AddWithValue("@Title", model.Title);
            col.AddWithValue("@Description", model.Description);
            col.AddWithValue("@Percentage", model.Percentage);
            col.AddWithValue("@ValidFrom", model.ValidFrom);
            col.AddWithValue("@ValidUntil", model.ValidUntil);
            col.AddWithValue("@IsRedeemedAllowed", model.IsRedeemedAllowed);
        }

        private Discount DiscountMapper(IDataReader reader)
        {
            Discount discount = new Discount();

            int startingIndex = 0;

            discount.Id = reader.GetSafeInt32(startingIndex++);

            discount.Product = new DiscountProduct();
            discount.Product.Id = reader.GetSafeInt32(startingIndex++);
            discount.Product.Year = reader.GetSafeInt32(startingIndex++);
            discount.Product.Manufacturer = reader.GetSafeString(startingIndex++);
            discount.Product.Name = reader.GetSafeString(startingIndex++);
            discount.Product.SKU = reader.GetSafeString(startingIndex++);

            discount.CouponCode = reader.GetSafeString(startingIndex++);
            discount.Title = reader.GetSafeString(startingIndex++);
            discount.Description = reader.GetSafeString(startingIndex++);
            discount.Percentage = reader.GetSafeDecimal(startingIndex++);
            discount.ValidFrom = reader.GetSafeUtcDateTime(startingIndex++);
            discount.ValidUntil = reader.GetSafeUtcDateTime(startingIndex++);
            discount.IsRedeemedAllowed = reader.GetSafeBool(startingIndex++);
            discount.DateCreated = reader.GetSafeDateTime(startingIndex++);
            discount.DateModified = reader.GetSafeDateTime(startingIndex++);
            discount.CreatedBy = reader.GetSafeInt32(startingIndex++);
            discount.ModifiedBy = reader.GetSafeInt32(startingIndex++);

            return discount;
        }
    }
}