using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Specifications;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services
{
    public class SpecificationService : ISpecificationService
        
    {
        private IDataProvider _data = null;
        
        public SpecificationService(IDataProvider data)
        {
            _data = data;
        }
        
        public int Add(SpecificationAddRequest model, int productId,  int userId)
        {
            int id = 0;
            
            string procName = "[dbo].[Specification_Insert]";
            
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                
                col.AddWithValue("@ProductId", productId);
                col.AddWithValue("@CreatedBy", userId);
                AddCommonParams(model, col);
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
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

        public void Update(SpecificationUpdateRequest model, int id,  int userId)
        {
            string procName = "[dbo].[Specification_Update]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", model.Id);
                col.AddWithValue("@ProductId", id);
                col.AddWithValue("@ModifiedBy", userId);

                AddCommonParams(model, col);
            },
            returnParameters: null);
        }

        public Specifications Get (int productId)
        {
            string procName = "[dbo].[Specification_Select_ById]";

            Specifications specs = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@ProductId", productId);
            },
            delegate (IDataReader reader, short set)
            {
                specs = MapSpecs(reader);
            });
            return specs;
        }

        public static Specifications MapSpecs(IDataReader reader)
        {
            Specifications Specs = new Specifications();

            int index = 0;

            Specs.Id = reader.GetSafeInt32(index++);
            Specs.ProductId = reader.GetSafeInt32(index++);
            Specs.Frame = reader.GetSafeString(index++);
            Specs.Fork = reader.GetSafeString(index++);
            Specs.Wheelset = reader.GetSafeString(index++);
            Specs.FrontHub = reader.GetSafeString(index++);
            Specs.RearHub = reader.GetSafeString(index++);
            Specs.RimFront = reader.GetSafeString(index++);
            Specs.RimRear = reader.GetSafeString(index++);
            Specs.TireFront = reader.GetSafeString(index++);
            Specs.TireRear = reader.GetSafeString(index++);
            Specs.Tires = reader.GetSafeString(index++);
            Specs.Shifters = reader.GetSafeString(index++);
            Specs.FrontDerailleur = reader.GetSafeString(index++);
            Specs.RearDerailleur = reader.GetSafeString(index++);
            Specs.Crankset = reader.GetSafeString(index++);
            Specs.BottomBracket = reader.GetSafeString(index++);
            Specs.Cassette = reader.GetSafeString(index++);
            Specs.Chain = reader.GetSafeString(index++);
            Specs.Pedals = reader.GetSafeString(index++);
            Specs.Saddle = reader.GetSafeString(index++);
            Specs.Seatpost = reader.GetSafeString(index++);
            Specs.Handlebar = reader.GetSafeString(index++);
            Specs.Grips = reader.GetSafeString(index++);
            Specs.Stem = reader.GetSafeString(index++);
            Specs.Headset = reader.GetSafeString(index++);
            Specs.Brakeset = reader.GetSafeString(index++);
            Specs.Weight = reader.GetSafeString(index++);
            Specs.WeightLimit = reader.GetSafeString(index++);
            Specs.CreatedBy = reader.GetSafeInt32(index++);
            Specs.ModifiedBy = reader.GetSafeInt32(index++);
            Specs.DateCreated = reader.GetSafeDateTime(index++);
            Specs.DateModified = reader.GetSafeDateTime(index++);

            return Specs;
        }
        
        private static void AddCommonParams(SpecificationAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Frame", model.Frame);
            col.AddWithValue("@Fork", model.Fork);
            col.AddWithValue("@Wheelset", model.Wheelset);
            col.AddWithValue("@FrontHub", model.FrontHub);
            col.AddWithValue("@RearHub", model.RearHub);
            col.AddWithValue("@RimFront", model.RimFront);
            col.AddWithValue("@RimRear", model.RimRear);
            col.AddWithValue("@TireFront", model.TireFront);
            col.AddWithValue("@TireRear", model.TireRear);
            col.AddWithValue("@Tires", model.Tires);
            col.AddWithValue("@Shifters", model.Shifters);
            col.AddWithValue("@FrontDerailleur", model.FrontDerailleur);
            col.AddWithValue("@RearDerailleur", model.RearDerailleur);
            col.AddWithValue("@Crankset", model.Crankset);
            col.AddWithValue("@BottomBracket", model.BottomBracket);
            col.AddWithValue("@Cassette", model.Cassette);
            col.AddWithValue("@Chain", model.Chain);
            col.AddWithValue("@Pedals", model.Pedals);
            col.AddWithValue("@Saddle", model.Saddle);
            col.AddWithValue("@Seatpost", model.Seatpost);
            col.AddWithValue("@Handlebar", model.Handlebar);
            col.AddWithValue("@Grips", model.Grips);
            col.AddWithValue("@Stem", model.Stem);
            col.AddWithValue("@Headset", model.Headset);
            col.AddWithValue("@Brakeset", model.Brakeset);
            col.AddWithValue("@Weight", model.Weight);
            col.AddWithValue("@WeightLimit", model.WeightLimit);
        }
    }
}