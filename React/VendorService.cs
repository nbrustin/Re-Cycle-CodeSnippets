using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Vendor;
using Sabio.Models.Requests.Vendors;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services
{
    public class VendorService : IVendorService
    {
        IDataProvider _data = null;

        public VendorService(IDataProvider data)
        {
            _data = data;
        }

        public int Add(VendorAddRequest model, int userId)
        {
            int id = 0;

            _data.ExecuteNonQuery("dbo.Vendors_Insert",
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

        public void Update(VendorUpdateRequest model, int userId)
        {
            _data.ExecuteNonQuery("dbo.Vendors_Update",
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddParams(model, col);
                    col.AddWithValue("@Id", model.Id);
                    col.AddWithValue("@PrimaryImageId", model.PrimaryImageId);

                });
        }

        public Vendor Get(int id)
        {
            Vendor vendor = null;

            _data.ExecuteCmd("dbo.Vendors_Select_ById", delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                vendor = VendorMapper(reader);
            }
            );
            return vendor;
        }

        public Paged<Vendor> Get(int pageIndex, int pageSize)
        {
            Paged<Vendor> pagedResult = null;
            List<Vendor> result = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                "dbo.Vendors_SelectAll",
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@PageIndex", pageIndex);
                    parameterCollection.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    Vendor model = VendorMapper(reader);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(10);
                    }

                    if (result == null)
                    {
                        result = new List<Vendor>();
                    }

                    result.Add(model);

                }
                );
            if (result != null)
            {
                pagedResult = new Paged<Vendor>(result, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public Vendor GetByCurrent(int createdBy)
        {
            Vendor vendor = null;
            

            _data.ExecuteCmd("dbo.Vendors_Select_ByCreatedByV2", delegate (SqlParameterCollection paramcollection)
            {
                paramcollection.AddWithValue("@CreatedBy", createdBy);
            }, delegate (IDataReader reader, short set)
            {
                vendor = VendorMapper(reader);
                
            });

            return vendor;
        }

        public void UpdateStatus(int id, int isActive)
        {
            _data.ExecuteNonQuery("dbo.Vendors_UpdateStatus", delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
                paramCollection.AddWithValue("@IsActive", isActive);
            });
        }



        private Vendor VendorMapper(IDataReader reader)
        {
            Vendor vendor = new Vendor();
            vendor.File = new File();

            int startingIndex = 0;

            vendor.Id = reader.GetSafeInt32(startingIndex++);
            vendor.Name = reader.GetSafeString(startingIndex++);
            vendor.Description = reader.GetSafeString(startingIndex++);
            vendor.Headline = reader.GetSafeString(startingIndex++);
            vendor.PrimaryImageId = reader.GetSafeInt32(startingIndex++);
            vendor.File.Url = reader.GetSafeString(startingIndex++);
            vendor.IsActive = reader.GetSafeBool(startingIndex++);
            vendor.DateCreated = reader.GetSafeDateTime(startingIndex++);
            vendor.DateModified = reader.GetSafeDateTime(startingIndex++);
            vendor.CreatedBy = reader.GetSafeInt32(startingIndex++);

            return vendor;
        }

        private static void AddParams(VendorAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@Description", model.Description);
            col.AddWithValue("@Headline", model.Headline);
            col.AddWithValue("@Url", model.Url);
        }
    }
}
