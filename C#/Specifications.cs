using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class Specifications
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        public string Frame { get; set; }

        public string Fork { get; set; }

        public string Wheelset { get; set; }

        public string FrontHub { get; set; }

        public string RearHub { get; set; }

        public string RimFront { get; set; }

        public string RimRear { get; set; }

        public string TireFront { get; set; }

        public string TireRear { get; set; }

        public string Tires { get; set; }

        public string Shifters { get; set; }

        public string FrontDerailleur { get; set; }

        public string RearDerailleur { get; set; }

        public string Crankset { get; set; }

        public string BottomBracket { get; set; }

        public string Cassette { get; set; }

        public string Chain { get; set; }

        public string Pedals { get; set; }

        public string Saddle { get; set; }

        public string Seatpost { get; set; }

        public string Handlebar { get; set; }

        public string Grips { get; set; }

        public string Stem { get; set; }

        public string Headset { get; set; }

        public string Brakeset { get; set; }

        public string Weight { get; set; }

        public string WeightLimit { get; set; }

        public int CreatedBy { get; set; }

        public int ModifiedBy { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime DateModified { get; set; }
    }
}