import React from "react";
import * as discountService from "../../services/discountService";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import localeInfo from "rc-pagination/lib/locale/en_US";
import DiscountCard from "./DiscountCard";
import { Row } from "reactstrap";
import PropTypes from "prop-types";
import "./discountStyle.css";
import swal from "sweetalert";

class Discount extends React.Component {
  state = {
    discounts: [],
    mappedDiscounts: [],
    current: 1,
    totalCount: 0,
    totalPages: 0,
    pageSize: 12
  };

  componentDidMount() {
    this.getAllPaginate();
  }

  getAllPaginate = () => {
    discountService
      .getPaginate(this.state.current - 1, this.state.pageSize)
      .then(this.getAllDiscountsSuccess)
      .catch(this.onActionError);
  };

  onChange = page => {
    this.setState(
      prevState => {
        return { ...prevState, current: page };
      },
      () => this.getAllPaginate()
    );
  };

  getAllDiscountsSuccess = response => {
    let answer = response.item;
    this.setState(prevState => {
      return {
        ...prevState,
        discounts: answer.pagedItems,
        mappedDiscounts: answer.pagedItems.map(this.mapDiscounts),
        totalCount: answer.totalCount,
        totalPages: answer.totalPages
      };
    });
  };

  onEdit = item => {
    this.props.history.push({
      pathname: "discounts/" + item.id + "/edit",
      state: { discount: item }
    });
  };

  onDelete = id => {
    swal({
      title: "Delete Coupon Code?",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        swal("Coupon Code Deleted", {
          icon: "success"
        });
        discountService
          .deleteDiscount(id)
          .then(this.onDeleteSuccess)
          .catch(this);
      }
    });
  };

  onDeleteSuccess = id => {
    const newDiscounts = [...this.state.discounts];
    let index = newDiscounts.findIndex(item => item.id === id);
    if (index >= 0) {
      newDiscounts[index].isRedeemed = false;
      newDiscounts.splice(index, 1);
    }

    this.setState(prevState => {
      return {
        ...prevState,
        discounts: newDiscounts,
        mappedDiscounts: newDiscounts.map(this.mapDiscounts)
      };
    });
  };

  mapDiscounts = aDiscount => {
    return (
      <DiscountCard
        item={aDiscount}
        key={aDiscount.id}
        editDiscount={this.onEdit}
        deleteDiscount={this.onDelete}
      />
    );
  };

  render() {
    return (
      <div className="container">
        <Row>{this.state.mappedDiscounts}</Row>
        <Row style={{ margin: "10px" }}>
          <div className="pagination">
            <Pagination
              onChange={this.onChange}
              current={this.state.current}
              pageSize={this.state.pageSize}
              total={this.state.totalCount}
              showQuickJumper
              showSizeChanger
              locale={localeInfo}
              showTotal={(total, range) =>
                `${range[0]} - ${range[1]} of ${total} item`
              }
            />
          </div>
        </Row>
      </div>
    );
  }
}
export default Discount;

Discount.propTypes = {
  history: PropTypes.object
};
