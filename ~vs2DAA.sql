USE [C76_Recycle]
GO
/****** Object:  StoredProcedure [dbo].[Products_Filter_MasterV2]    Script Date: 9/5/2019 7:31:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROC [dbo].[Products_Filter_MasterV2]
		
		@ProductTypeId INT = null
		,@Material NVARCHAR(255) = null
		,@Color NVARCHAR(255) = null
		,@Size NVARCHAR(55) = null
		,@pageIndex INT
		,@pageSize INT
AS 

/*
Declare
				@ProductTypeId INT = 1
				,@Material NVARCHAR(255) = 'Carbon'
				,@Color NVARCHAR(255) = 'Red'
				,@Size NVARCHAR(55) = 26
				,@pageIndex INT
				,@pageSize INT

EXECUTE [dbo].[Products_Filter_MasterV2]
		             @ProductTypeId
					,@Material 
				    ,@Color 
				    ,@Size 
					,@pageIndex
					,@pageSize

Select * from dbo.products
*/

BEGIN

	DECLARE @offset INT = @pageIndex * @pageSize

		--filter all--
		IF ((@ProductTypeId IS NOT NULL AND @ProductTypeId >0) AND @Material IS NOT NULL and @Color IS NOT NULL AND @Size IS NOT NULL) 
			BEGIN
		
			SELECT
				   P.[Id]
		  ,P.[Manufacturer]
		  ,P.[Year]
		  ,P.[Name]
		  ,P.[SKU]
		  ,P.[Description]
		  ,P.[ProductTypeId]
		  ,P.[VendorId]
		  ,P.[ConditionTypeId]
		  ,P.[IsVisible]
		  ,P.[IsActive]
		  ,P.[PrimaryImage]
		  ,P.[DateCreated]
		  ,P.[DateModified]
		  ,P.[CreatedBy]
		  ,P.[ModifiedBy]
		  ,P.[Specifications]
		  ,T.[Id]
		  ,T.[Name]
		  ,T.[Description]
		  ,I.[Id]
		  ,I.[BasePrice]
		  ,I.[Quantity]
		  ,I.[ProductId]
		  ,TotalCount = COUNT(1) OVER()

	FROM [dbo].[Products] AS P

	INNER JOIN [dbo].[ProductType] AS T
	ON T.Id = P.ProductTypeId

	INNER JOIN [dbo].[Inventory] AS I
	ON P.Id = I.ProductId

			  CROSS APPLY OPENJSON([Specifications]) WITH (Material nvarchar(255) '$.Material', Color nvarchar(255) '$.Color', Size nvarchar(55) '$.Size') as jsonValues 
							Where  jsonValues.Material = @Material AND jsonValues.Color = @Color
							AND ProductTypeId = @ProductTypeId AND jsonValues.Size = @Size

		END

		--filter ProductTypeId Only--
		ELSE IF((@ProductTypeId IS NOT NULL AND @ProductTypeId >0) AND @Material IS NULL AND @Color IS NULL AND @Size IS NULL)
			BEGIN

			SELECT

				 P.[Id]
		  ,P.[Manufacturer]
		  ,P.[Year]
		  ,P.[Name]
		  ,P.[SKU]
		  ,P.[Description]
		  ,P.[ProductTypeId]
		  ,P.[VendorId]
		  ,P.[ConditionTypeId]
		  ,P.[IsVisible]
		  ,P.[IsActive]
		  ,P.[PrimaryImage]
		  ,P.[DateCreated]
		  ,P.[DateModified]
		  ,P.[CreatedBy]
		  ,P.[ModifiedBy]
		  ,P.[Specifications]
		  ,T.[Id]
		  ,T.[Name]
		  ,T.[Description]
		  ,I.[Id]
		  ,I.[BasePrice]
		  ,I.[Quantity]
		  ,I.[ProductId]
		  ,TotalCount = COUNT(1) OVER()

	FROM [dbo].[Products] AS P

	INNER JOIN [dbo].[ProductType] AS T
	ON T.Id = P.ProductTypeId

	INNER JOIN [dbo].[Inventory] AS I
	ON P.Id = I.ProductId

				Where  ProductTypeId = @ProductTypeId 

		END

		--filter by ProductTypeId AND Material
		ELSE IF((@ProductTypeId IS NOT NULL AND @ProductTypeId >0) AND @Material IS NOT NULL AND @Color IS NULL AND @Size IS NULL)
			BEGIN

			SELECT
				  P.[Id]
		  ,P.[Manufacturer]
		  ,P.[Year]
		  ,P.[Name]
		  ,P.[SKU]
		  ,P.[Description]
		  ,P.[ProductTypeId]
		  ,P.[VendorId]
		  ,P.[ConditionTypeId]
		  ,P.[IsVisible]
		  ,P.[IsActive]
		  ,P.[PrimaryImage]
		  ,P.[DateCreated]
		  ,P.[DateModified]
		  ,P.[CreatedBy]
		  ,P.[ModifiedBy]
		  ,P.[Specifications]
		  ,T.[Id]
		  ,T.[Name]
		  ,T.[Description]
		  ,I.[Id]
		  ,I.[BasePrice]
		  ,I.[Quantity]
		  ,I.[ProductId]
		  ,TotalCount = COUNT(1) OVER()

	FROM [dbo].[Products] AS P

	INNER JOIN [dbo].[ProductType] AS T
	ON T.Id = P.ProductTypeId

	INNER JOIN [dbo].[Inventory] AS I
	ON P.Id = I.ProductId

			  CROSS APPLY OPENJSON([Specifications]) WITH (Material nvarchar(255) '$.Material') as jsonValues 
							Where  jsonValues.Material = @Material AND ProductTypeId = @ProductTypeId 

			END

			--filter by ProductTypeId AND Color--
			ELSE IF((@ProductTypeId IS NOT NULL AND @ProductTypeId >0) AND @Material IS NULL AND @Color IS NOT NULL AND @Size IS NULL)
				BEGIN

			SELECT
				  P.[Id]
		  ,P.[Manufacturer]
		  ,P.[Year]
		  ,P.[Name]
		  ,P.[SKU]
		  ,P.[Description]
		  ,P.[ProductTypeId]
		  ,P.[VendorId]
		  ,P.[ConditionTypeId]
		  ,P.[IsVisible]
		  ,P.[IsActive]
		  ,P.[PrimaryImage]
		  ,P.[DateCreated]
		  ,P.[DateModified]
		  ,P.[CreatedBy]
		  ,P.[ModifiedBy]
		  ,P.[Specifications]
		  ,T.[Id]
		  ,T.[Name]
		  ,T.[Description]
		  ,I.[Id]
		  ,I.[BasePrice]
		  ,I.[Quantity]
		  ,I.[ProductId]
		  ,TotalCount = COUNT(1) OVER()

	FROM [dbo].[Products] AS P

	INNER JOIN [dbo].[ProductType] AS T
	ON T.Id = P.ProductTypeId

	INNER JOIN [dbo].[Inventory] AS I
	ON P.Id = I.ProductId

			  CROSS APPLY OPENJSON([Specifications]) WITH (Color nvarchar(255) '$.Color') as jsonValues 
							Where  jsonValues.Color = @Color
							AND ProductTypeId = @ProductTypeId 
			END

			--filter by ProductTypeId and Size
				ELSE IF ((@ProductTypeId IS NOT NULL AND @ProductTypeId >0) AND @Material IS NULL and @Color IS NULL AND @Size IS NOT NULL) 
			BEGIN

			SELECT
				  P.[Id]
		  ,P.[Manufacturer]
		  ,P.[Year]
		  ,P.[Name]
		  ,P.[SKU]
		  ,P.[Description]
		  ,P.[ProductTypeId]
		  ,P.[VendorId]
		  ,P.[ConditionTypeId]
		  ,P.[IsVisible]
		  ,P.[IsActive]
		  ,P.[PrimaryImage]
		  ,P.[DateCreated]
		  ,P.[DateModified]
		  ,P.[CreatedBy]
		  ,P.[ModifiedBy]
		  ,P.[Specifications]
		  ,T.[Id]
		  ,T.[Name]
		  ,T.[Description]
		  ,I.[Id]
		  ,I.[BasePrice]
		  ,I.[Quantity]
		  ,I.[ProductId]
		  ,TotalCount = COUNT(1) OVER()

	FROM [dbo].[Products] AS P

	INNER JOIN [dbo].[ProductType] AS T
	ON T.Id = P.ProductTypeId

	INNER JOIN [dbo].[Inventory] AS I
	ON P.Id = I.ProductId

			  CROSS APPLY OPENJSON([Specifications]) WITH (Size nvarchar(55) '$.Size') as jsonValues 
							Where ProductTypeId = @ProductTypeId AND jsonValues.Size = @Size

		END

		--filter by Material only--

		ELSE IF ((@ProductTypeId IS NULL OR @ProductTypeId = 0) AND @Material IS NOT NULL and @Color IS NULL AND @Size IS NULL) 
			BEGIN

			SELECT
				  P.[Id]
		  ,P.[Manufacturer]
		  ,P.[Year]
		  ,P.[Name]
		  ,P.[SKU]
		  ,P.[Description]
		  ,P.[ProductTypeId]
		  ,P.[VendorId]
		  ,P.[ConditionTypeId]
		  ,P.[IsVisible]
		  ,P.[IsActive]
		  ,P.[PrimaryImage]
		  ,P.[DateCreated]
		  ,P.[DateModified]
		  ,P.[CreatedBy]
		  ,P.[ModifiedBy]
		  ,P.[Specifications]
		  ,T.[Id]
		  ,T.[Name]
		  ,T.[Description]
		  ,I.[Id]
		  ,I.[BasePrice]
		  ,I.[Quantity]
		  ,I.[ProductId]
		  ,TotalCount = COUNT(1) OVER()

	FROM [dbo].[Products] AS P

	INNER JOIN [dbo].[ProductType] AS T
	ON T.Id = P.ProductTypeId

	INNER JOIN [dbo].[Inventory] AS I
	ON P.Id = I.ProductId
			  CROSS APPLY OPENJSON([Specifications]) WITH (Material nvarchar(255) '$.Material') as jsonValues 
							Where  jsonValues.Material = @Material 

		END

		--filter by Material and Color--
		ELSE IF ((@ProductTypeId IS NULL OR @ProductTypeId = 0) AND @Material IS NOT NULL and @Color IS NOT NULL AND @Size IS NULL) 
			BEGIN

			SELECT
				 P.[Id]
		  ,P.[Manufacturer]
		  ,P.[Year]
		  ,P.[Name]
		  ,P.[SKU]
		  ,P.[Description]
		  ,P.[ProductTypeId]
		  ,P.[VendorId]
		  ,P.[ConditionTypeId]
		  ,P.[IsVisible]
		  ,P.[IsActive]
		  ,P.[PrimaryImage]
		  ,P.[DateCreated]
		  ,P.[DateModified]
		  ,P.[CreatedBy]
		  ,P.[ModifiedBy]
		  ,P.[Specifications]
		  ,T.[Id]
		  ,T.[Name]
		  ,T.[Description]
		  ,I.[Id]
		  ,I.[BasePrice]
		  ,I.[Quantity]
		  ,I.[ProductId]
		  ,TotalCount = COUNT(1) OVER()

	FROM [dbo].[Products] AS P

	INNER JOIN [dbo].[ProductType] AS T
	ON T.Id = P.ProductTypeId

	INNER JOIN [dbo].[Inventory] AS I
	ON P.Id = I.ProductId
			  CROSS APPLY OPENJSON([Specifications]) WITH (Material nvarchar(255) '$.Material', Color nvarchar(255) '$.Color') as jsonValues 
							Where  jsonValues.Material = @Material AND jsonValues.Color = @Color

		END

		--filter by Material and Size--
		ELSE IF ((@ProductTypeId IS NULL OR @ProductTypeId = 0) AND @Material IS NOT NULL and @Color IS NULL AND @Size IS NOT NULL) 
			BEGIN

			SELECT
				  P.[Id]
		  ,P.[Manufacturer]
		  ,P.[Year]
		  ,P.[Name]
		  ,P.[SKU]
		  ,P.[Description]
		  ,P.[ProductTypeId]
		  ,P.[VendorId]
		  ,P.[ConditionTypeId]
		  ,P.[IsVisible]
		  ,P.[IsActive]
		  ,P.[PrimaryImage]
		  ,P.[DateCreated]
		  ,P.[DateModified]
		  ,P.[CreatedBy]
		  ,P.[ModifiedBy]
		  ,P.[Specifications]
		  ,T.[Id]
		  ,T.[Name]
		  ,T.[Description]
		  ,I.[Id]
		  ,I.[BasePrice]
		  ,I.[Quantity]
		  ,I.[ProductId]
		  ,TotalCount = COUNT(1) OVER()

	FROM [dbo].[Products] AS P

	INNER JOIN [dbo].[ProductType] AS T
	ON T.Id = P.ProductTypeId

	INNER JOIN [dbo].[Inventory] AS I
	ON P.Id = I.ProductId
			  CROSS APPLY OPENJSON([Specifications]) WITH (Material nvarchar(255) '$.Material', Size nvarchar(55) '$.Size') as jsonValues 
							Where  jsonValues.Material = @Material
							 AND jsonValues.Size = @Size

		END

		--Filter by Color Only--
		ELSE IF((@ProductTypeId IS NULL OR @ProductTypeId = 0) AND @Material IS NULL and @Color IS NOT NULL AND @Size IS NULL) 
			BEGIN

			SELECT
				  P.[Id]
		  ,P.[Manufacturer]
		  ,P.[Year]
		  ,P.[Name]
		  ,P.[SKU]
		  ,P.[Description]
		  ,P.[ProductTypeId]
		  ,P.[VendorId]
		  ,P.[ConditionTypeId]
		  ,P.[IsVisible]
		  ,P.[IsActive]
		  ,P.[PrimaryImage]
		  ,P.[DateCreated]
		  ,P.[DateModified]
		  ,P.[CreatedBy]
		  ,P.[ModifiedBy]
		  ,P.[Specifications]
		  ,T.[Id]
		  ,T.[Name]
		  ,T.[Description]
		  ,I.[Id]
		  ,I.[BasePrice]
		  ,I.[Quantity]
		  ,I.[ProductId]
		  ,TotalCount = COUNT(1) OVER()

	FROM [dbo].[Products] AS P

	INNER JOIN [dbo].[ProductType] AS T
	ON T.Id = P.ProductTypeId

	INNER JOIN [dbo].[Inventory] AS I
	ON P.Id = I.ProductId
			  CROSS APPLY OPENJSON([Specifications]) WITH (Color nvarchar(255) '$.Color') as jsonValues 
							Where  jsonValues.Color = @Color

		END

		--filter by Color and Size--

		ELSE IF ((@ProductTypeId IS NULL OR @ProductTypeId = 0) AND @Material IS NULL and @Color IS NOT NULL AND @Size IS NOT NULL) 
			BEGIN

			SELECT
				  P.[Id]
		  ,P.[Manufacturer]
		  ,P.[Year]
		  ,P.[Name]
		  ,P.[SKU]
		  ,P.[Description]
		  ,P.[ProductTypeId]
		  ,P.[VendorId]
		  ,P.[ConditionTypeId]
		  ,P.[IsVisible]
		  ,P.[IsActive]
		  ,P.[PrimaryImage]
		  ,P.[DateCreated]
		  ,P.[DateModified]
		  ,P.[CreatedBy]
		  ,P.[ModifiedBy]
		  ,P.[Specifications]
		  ,T.[Id]
		  ,T.[Name]
		  ,T.[Description]
		  ,I.[Id]
		  ,I.[BasePrice]
		  ,I.[Quantity]
		  ,I.[ProductId]
		  ,TotalCount = COUNT(1) OVER()

	FROM [dbo].[Products] AS P

	INNER JOIN [dbo].[ProductType] AS T
	ON T.Id = P.ProductTypeId

	INNER JOIN [dbo].[Inventory] AS I
	ON P.Id = I.ProductId
			  CROSS APPLY OPENJSON([Specifications]) WITH (Color nvarchar(255) '$.Color', Size nvarchar(55) '$.Size') as jsonValues 
							Where  jsonValues.Color = @Color AND jsonValues.Size = @Size

			END

			--filter by Size Only--
			ELSE  
			
			BEGIN

			SELECT
			P.[Id]
		  ,P.[Manufacturer]
		  ,P.[Year]
		  ,P.[Name]
		  ,P.[SKU]
		  ,P.[Description]
		  ,P.[ProductTypeId]
		  ,P.[VendorId]
		  ,P.[ConditionTypeId]
		  ,P.[IsVisible]
		  ,P.[IsActive]
		  ,P.[PrimaryImage]
		  ,P.[DateCreated]
		  ,P.[DateModified]
		  ,P.[CreatedBy]
		  ,P.[ModifiedBy]
		  ,P.[Specifications]
		  ,T.[Id]
		  ,T.[Name]
		  ,T.[Description]
		  ,I.[Id]
		  ,I.[BasePrice]
		  ,I.[Quantity]
		  ,I.[ProductId]
		  ,TotalCount = COUNT(1) OVER()

	FROM [dbo].[Products] AS P

	INNER JOIN [dbo].[ProductType] AS T
	ON T.Id = P.ProductTypeId

	INNER JOIN [dbo].[Inventory] AS I
	ON P.Id = I.ProductId
			  CROSS APPLY OPENJSON([Specifications]) WITH (Size nvarchar(55) '$.Size') as jsonValues 
							Where  jsonValues.Size = @Size

			END


END


