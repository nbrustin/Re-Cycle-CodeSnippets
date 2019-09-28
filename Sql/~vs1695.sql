USE [C76_Recycle]
GO
/****** Object:  StoredProcedure [dbo].[Files_SelectAll]    Script Date: 9/28/2019 1:52:05 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROC [dbo].[Files_SelectAll]

	@pageIndex int
	,@pageSize int

/*

	Declare @pageIndex int = 0
			,@pageSize int = 6

	Execute dbo.Files_SelectAll
		@pageIndex
		,@pageSize

	Select *
	From dbo.Files

*/

AS

BEGIN

DECLARE @offset int = @pageIndex * @pageSize

SELECT [Id]
		,[Name]
      ,[Url]
      ,[FileTypeId]
      ,[CreatedBy]
      ,[DateCreated]
	  ,[TotalCount] = COUNT(1) OVER()

  FROM [dbo].[Files]
  ORDER BY DateCreated DESC

  Offset @offset ROWS
  FETCH NEXT @pageSize ROWS Only

END
