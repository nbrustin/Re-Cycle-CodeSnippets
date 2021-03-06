USE [C76_Recycle]
GO
/****** Object:  StoredProcedure [dbo].[Products_Filter_MasterV3]    Script Date: 12/12/2019 12:35:43 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROC [dbo].[Products_Filter_MasterV3]
		
		@ProductTypeId INT = null
		,@ColorTypeId INT = null
		,@pageIndex INT
		,@pageSize INT
AS 

/*
Declare
				@ProductTypeId INT = ""
				,@ColorTypeId INT = 1
				,@pageIndex INT
				,@pageSize INT

EXECUTE [dbo].[Products_Filter_MasterV3]
		             @ProductTypeId
				    ,@ColorTypeId
					,@pageIndex
					,@pageSize

Select * from dbo.products
*/

BEGIN

	DECLARE @offset INT = @pageIndex * @pageSize

		--filter all--
		IF ((@ProductTypeId IS NOT NULL AND @ProductTypeId >0) AND (@ColorTypeId IS NOT NULL AND @ColorTypeId >0 ) )
		
		BEGIN

		SELECT   	
			P.[Id]
			,P.[Manufacturer]
			,P.[Year]
			,P.[Model]
			,CT.[Id]
			,CT.[Name]
			,P.[SKU]
			,P.[Description]
			,P.[Quantity]
			,PT.[Id]
			,PT.[Name]
			,PT.[Description]
			,P.[BasePrice]
			,PCT.[Id]
			,PCT.[Name]
			,P.[PrimaryImage]
			,P.[IsVisible]
			,P.[IsActive]
			,P.[CreatedBy]
			,P.[ModifiedBy]
			,P.[DateCreated]
			,P.[DateModified]
			,S.Id
			,[Frame]
			,[Fork]
			,[Wheelset]
			,[FrontHub]
			,[RearHub]
			,[RimFront]
			,[RimRear]
			,[TireFront]
			,[TireRear]
			,[Tires]
			,[Shifters]
			,[FrontDerailleur]
			,[RearDerailleur]
			,[Crankset]
			,[BottomBracket]
			,[Cassette]
			,[Chain]
			,[Pedals]
			,[Saddle]
			,[Seatpost]
			,[Handlebar]
			,[Grips]
			,[Stem]
			,[Headset]
			,[Brakeset]
			,[Weight]
			,[WeightLimit]
			,S.[CreatedBy]
			,S.[ModifiedBy]
			,S.[DateCreated]
			,S.[DateModified]

		   ,[TotalCount] = COUNT(1) OVER()


	FROM [dbo].[Products] AS P

	
	INNER JOIN dbo.ProductType as PT
		on PT.Id = P.ProductTypeId

	INNER JOIN dbo.ProductConditionTypes as PCT
		on PCT.Id = P.ConditionTypeId
	 
	INNER JOIN dbo.Specification as S
		on S.ProductId = P.Id

	INNER JOIN dbo.ColorType as CT
		on CT.Id = P.ColorTypeId
	
	WHERE P.ProductTypeId = @ProductTypeId AND P.ColorTypeId = @ColorTypeId

		END

		--filter ProductTypeId Only--
		ELSE IF((@ProductTypeId IS NOT NULL AND @ProductTypeId >0) AND ( @ColorTypeId IS NULL or @ColorTypeId = 0))
					BEGIN

		SELECT   	
			P.[Id]
			,P.[Manufacturer]
			,P.[Year]
			,P.[Model]
			,CT.[Id]
			,CT.[Name]
			,P.[SKU]
			,P.[Description]
			,P.[Quantity]
			,PT.[Id]
			,PT.[Name]
			,PT.[Description]
			,P.[BasePrice]
			,PCT.[Id]
			,PCT.[Name]
			,P.[PrimaryImage]
			,P.[IsVisible]
			,P.[IsActive]
			,P.[CreatedBy]
			,P.[ModifiedBy]
			,P.[DateCreated]
			,P.[DateModified]
			,S.Id
			,[Frame]
			,[Fork]
			,[Wheelset]
			,[FrontHub]
			,[RearHub]
			,[RimFront]
			,[RimRear]
			,[TireFront]
			,[TireRear]
			,[Tires]
			,[Shifters]
			,[FrontDerailleur]
			,[RearDerailleur]
			,[Crankset]
			,[BottomBracket]
			,[Cassette]
			,[Chain]
			,[Pedals]
			,[Saddle]
			,[Seatpost]
			,[Handlebar]
			,[Grips]
			,[Stem]
			,[Headset]
			,[Brakeset]
			,[Weight]
			,[WeightLimit]
			,S.[CreatedBy]
			,S.[ModifiedBy]
			,S.[DateCreated]
			,S.[DateModified]

		   ,[TotalCount] = COUNT(1) OVER()


	FROM [dbo].[Products] AS P

	
	INNER JOIN dbo.ProductType as PT
		on PT.Id = P.ProductTypeId

	INNER JOIN dbo.ProductConditionTypes as PCT
		on PCT.Id = P.ConditionTypeId
	 
	INNER JOIN dbo.Specification as S
		on S.ProductId = P.Id

	INNER JOIN dbo.ColorType as CT
		on CT.Id = P.ColorTypeId
	
	WHERE P.ProductTypeId = @ProductTypeId 

		END
		

		--Filter by Color Only--
		ELSE IF((@ProductTypeId IS NULL OR @ProductTypeId = 0) AND  (@ColorTypeId IS NOT NULL AND @ColorTypeId > 0)) 
					BEGIN

		SELECT   	
			P.[Id]
			,P.[Manufacturer]
			,P.[Year]
			,P.[Model]
			,CT.[Id]
			,CT.[Name]
			,P.[SKU]
			,P.[Description]
			,P.[Quantity]
			,PT.[Id]
			,PT.[Name]
			,PT.[Description]
			,P.[BasePrice]
			,PCT.[Id]
			,PCT.[Name]
			,P.[PrimaryImage]
			,P.[IsVisible]
			,P.[IsActive]
			,P.[CreatedBy]
			,P.[ModifiedBy]
			,P.[DateCreated]
			,P.[DateModified]
			,S.Id
			,[Frame]
			,[Fork]
			,[Wheelset]
			,[FrontHub]
			,[RearHub]
			,[RimFront]
			,[RimRear]
			,[TireFront]
			,[TireRear]
			,[Tires]
			,[Shifters]
			,[FrontDerailleur]
			,[RearDerailleur]
			,[Crankset]
			,[BottomBracket]
			,[Cassette]
			,[Chain]
			,[Pedals]
			,[Saddle]
			,[Seatpost]
			,[Handlebar]
			,[Grips]
			,[Stem]
			,[Headset]
			,[Brakeset]
			,[Weight]
			,[WeightLimit]
			,S.[CreatedBy]
			,S.[ModifiedBy]
			,S.[DateCreated]
			,S.[DateModified]

		   ,[TotalCount] = COUNT(1) OVER()


	FROM [dbo].[Products] AS P

	
	INNER JOIN dbo.ProductType as PT
		on PT.Id = P.ProductTypeId

	INNER JOIN dbo.ProductConditionTypes as PCT
		on PCT.Id = P.ConditionTypeId
	 
	INNER JOIN dbo.Specification as S
		on S.ProductId = P.Id

	INNER JOIN dbo.ColorType as CT
		on CT.Id = P.ColorTypeId
	
	WHERE P.ColorTypeId = @ColorTypeId

		END
	
END


