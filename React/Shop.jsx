import React from "react";
import logger from "sabio-debug";
import PropTypes from "prop-types";
import ShopProductCard from "./ShopProductCard";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import * as productService from "../../services/productService";
import localeInfo from "rc-pagination/lib/locale/en_US";
// import SideBar from "./SideBar";
import "./ShopProductCard.css";
import "./Shop.css";
import * as shoppingCartService from "../../services/shoppingCartService";
import swal from "sweetalert";
import SearchBar from "./SearchBar";

const _logger = logger.extend("Shop");

class Shop extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();

    this.state = {
      products: [],
      mappedProducts: [],
      product: {
        id: "",
        name: "",
        description: "",
        productTypeId: "",
        vendorId: "",
        conditionTypeId: "",
        isVisible: "",
        isActive: "",
        primaryImage: "",
        specifications: ""
      },
      pageIndex: 1,
      pageSize: 12,
      totalCount: 0,
      totalPages: 0,
      productTypes: [],
      sidebarOpen: true,
      filterData: {
        productTypeId: 0,
        material: "",
        size: "",
        colorTypeId: 0
      }
    };
  }

  componentDidMount() {
    this.getProductCombinedTypes();
    if (this.props.location.state) {
      this.filterByBikeType();
    } else {
      this.getAll();
    }
  }

  componentWillReceiveProps(nextProps) {
    debugger;
    this.scrollToMyRef();
    _logger(nextProps);
    this.setState(
      prevState => {
        return {
          ...prevState,
          filterData: {
            ...prevState.filterData,
            productTypeId: nextProps.location.state.productTypeId,
            colorTypeId: nextProps.location.state.colorTypeId
          }
        };
      },
      () => this.filterDisplayedProducts()
    );
  }

  scrollToMyRef = () => {
    window.scrollTo(0, this.myRef.current.offsetTop);
  };

  filterByBikeType = () => {
    let productType = this.props.location.state.productTypeId;
    let colorType = this.state.filterData.colorTypeId;
    this.setState(
      prevState => {
        return {
          ...prevState,
          filterData: {
            ...prevState.filterData,
            productTypeId: productType,
            colorTypeId: colorType
          }
        };
      },
      () => this.filterDisplayedProducts()
    );
  };

  getProductCombinedTypes = () => {
    productService
      .getProductCombinedTypes()
      .then(this.onGetProductCombinedTypesSuccess)
      .catch(this.onGetProductCombinedTypesError);
  };

  getProductTypes = () => {
    productService
      .getAllProductTypes()
      .then(this.onGetAllTypesSuccess)
      .catch(this.OnGetAllTypesError);
  };

  onGetProductCombinedTypesSuccess = response => {
    this.setState(() => {
      return {
        productTypes: response.item.productTypes,
        colorTypes: response.item.colorTypes
      };
    });
  };

  onGetAllTypesSuccess = response => {
    this.setState(() => {
      return {
        productTypes: response.items
      };
    });
  };

  handlePriceChange = event => {
    let name = event.target.name;
    let value = event.target.value;

    this.setState(prevState => {
      return {
        ...prevState,
        filterData: {
          ...prevState.filterData,
          [name]: value
        }
      };
    });
  };

  filterByProductType = evt => {
    let value = evt.target.value;
    this.setState(prevState => {
      return {
        ...prevState,
        filterData: {
          ...prevState.filterData,
          productTypeId: value
        }
      };
    });
  };

  filterByMaterial = evt => {
    let value = evt.target.value;

    this.setState(prevState => {
      return {
        ...prevState,
        filterData: {
          ...prevState.filterData,
          material: value
        }
      };
    });
  };

  filterBySize = evt => {
    let value = evt.target.value;

    this.setState(prevState => {
      return {
        ...prevState,
        filterData: {
          ...prevState.filterData,
          size: value
        }
      };
    });
  };

  filterByColor = evt => {
    let value = evt.target.value;

    this.setState(prevState => {
      return {
        ...prevState,
        filterData: {
          ...prevState.filterData,
          colorTypeId: value
        }
      };
    });
  };

  filterDisplayedProducts = () => {
    debugger;
    _logger(this.state.filterData, "FILTER DATA");
    if (
      Number(this.state.filterData.productTypeId) === 0 &&
      Number(this.state.filterData.colorTypeId) === 0
    ) {
      this.getAll();
    } else {
      productService
        .filteredShop(
          this.state.pageIndex - 1,
          this.state.pageSize,
          this.state.filterData.productTypeId,
          // this.state.filterData.material,
          // this.state.filterData.size,
          this.state.filterData.colorTypeId
        )
        .then(this.onFilteredDisplaySuccess)
        .catch(this.onFilteredDisplayError);
    }
  };

  onFilteredDisplaySuccess = response => {
    const products = response.item.pagedItems;

    this.setState({
      products,
      mappedProducts: products.map(this.mapProduct),
      totalCount: response.item.totalCount
    });
  };

  onFilteredDisplayError = response => {
    const products = [];

    this.setState({
      mappedProducts: products.map(this.mapProduct),
      totalCount: 0
    });
    _logger(response);
    swal("Sorry!", "There are no products under the selected search criteria", {
      button: true,
      timer: 4000,
      icon: "error"
    });
  };

  // onSetSidebarOpen(open) {
  //   this.setState({ sidebarOpen: open });
  // }

  getAll = () => {
    productService
      .getPaginate(this.state.pageIndex - 1, 12)
      .then(this.onGetProductsSuccess)
      .then(this.resetSearchCriteria)
      .catch(this.onActionError);
  };

  resetSearchCriteria = () => {
    this.setState({
      filterData: {
        productTypeId: 0,
        colorTypeId: 0
      }
    });
  };

  onGetProductsSuccess = response => {
    const pgSize = response.item.pageSize;
    const tCount = response.item.totalCount;
    const tPages = response.item.totalPages;
    const products = response.item.pagedItems;

    this.setState({
      products,
      mappedProducts: products.map(this.mapProduct),
      pageSize: pgSize,
      totalCount: tCount,
      totalPages: tPages
    });
  };

  handlePage = pageNumber => {
    productService
      .getPaginate(pageNumber, 20)
      .then(this.onGetProductsSuccess)
      .catch(this.onActionError);
  };

  onChange = page => {
    this.setState({ pageIndex: page }, () => this.getAll());
  };

  productInformation = product => {
    this.props.history.push(`shop/product/${product.id}/details`, { product });
  };

  onActionError = errResponse => {
    _logger(errResponse);
    this.getAll();
  };

  handleAddToCart = data => {
    let shoppingCartObject = { inventoryId: data, quantity: 1 };
    shoppingCartService
      .create(shoppingCartObject)
      .then(this.onAddToCartSuccess)
      .catch(this.onAddToCartError);
  };

  onAddToCartSuccess = response => {
    _logger(response);
    swal("Item Added to Cart");
  };

  onAddToCartError = errResponse => {
    _logger(errResponse);
    swal("Failed to Add Item to Cart");
  };

  mapProduct = product => (
    <ShopProductCard
      key={product.id}
      product={product}
      productInformation={this.productInformation}
      handleAddToCart={this.handleAddToCart}
      currentUser={this.props.currentUser}
    />
  );

  handleShoppingCart = () => {
    this.props.history.push("/admin/shoppingcart");
  };

  render() {
    return (
      <React.Fragment>
        <div ref={this.myRef}></div>
        <div className="shop">
          <div className="content-wrapper">
            <div className="search">
              <div className="row">
                <div className="col-sm-8 ">
                  {this.state.productTypes.length > 0 ? (
                    <SearchBar
                      productTypes={this.state.productTypes}
                      colorTypes={this.state.colorTypes}
                      productTypeId={this.state.filterData.productTypeId}
                      colorTypeId={this.state.filterData.colorTypeId}
                      priceFrom={this.state.priceFrom}
                      handlePriceChange={this.handlePriceChange}
                      filterDisplayedProducts={this.filterDisplayedProducts}
                      filterByProductType={this.filterByProductType}
                      filterByMaterial={this.filterByMaterial}
                      filterBySize={this.filterBySize}
                      filterByColor={this.filterByColor}
                      reset={this.getAll}
                    />
                  ) : null}
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row cards ">{this.state.mappedProducts}</div>
            </div>
            <div className="col-md-8 offset-md-5">
              <Pagination
                style={{ marginTop: "35px" }}
                onChange={this.onChange}
                current={this.state.pageIndex}
                pageSize={this.state.pageSize}
                total={this.state.totalCount}
                showQuickJumper
                showSizeChanger
                locale={localeInfo}
                showTotal={(total, range) =>
                  `${range[0]} - ${range[1]} of ${total} items`
                }
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Shop.propTypes = {
  history: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  location: PropTypes.shape({
    state: PropTypes.object,
    productTypeId: PropTypes.number
  })
};

export default Shop;
