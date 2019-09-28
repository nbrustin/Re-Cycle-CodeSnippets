import React from "react";
import PropTypes from "prop-types";
import * as dateService from "../../services/dateService";
import "./discountStyle.css";

const DiscountCard = props => {
  const onEditButtonHandler = () => {
    props.editDiscount(props.item);
  };

  const onDeleteButtonHandler = () => {
    props.deleteDiscount(props.item.id);
  };

  return (
    <div className="col-md-3">
      <div className="card card-landing mb-6">
        <div className="card-body">
          <h4 className="d-flex couponCode">
            Coupon Code: {props.item.couponCode}
          </h4>
          <p>
            <b>Product Id: </b> {props.item.productId}
          </p>
          <p>
            <b>Title:</b> {props.item.title}
          </p>
          <p>
            <b>Description:</b> {props.item.description}
          </p>
          <p>
            <b>Discount:</b> {props.item.percentage}%
          </p>
          <p>
            <b>Valid From: </b>
            {`${dateService.formatDate(
              props.item.validFrom
            )} ${dateService.formatTime(props.item.validFrom)}`}
          </p>
          <p>
            <b>Valid Until: </b>
            {`${dateService.formatDate(
              props.item.validUntil
            )} ${dateService.formatTime(props.item.validUntil)}`}
          </p>
          <p>
            <b>Active: </b> {props.item.isRedeemedAllowed.toString()}
          </p>
        </div>
        <div className="buttons">
          <span className="float-right">
            <i
              className="fa-fw fa-md fa fa-edit mr-2"
              onClick={onEditButtonHandler}
            />
            <i
              className="fa-fw fa-md fas fa-trash-alt mr-2"
              onClick={onDeleteButtonHandler}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default DiscountCard;

DiscountCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
    couponCode: PropTypes.string,
    title: PropTypes.string,
    productId: PropTypes.number,
    description: PropTypes.string,
    percentage: PropTypes.number,
    validFrom: PropTypes.string,
    validUntil: PropTypes.string,
    isRedeemedAllowed: PropTypes.bool
  }),
  editDiscount: PropTypes.func,
  deleteDiscount: PropTypes.func
};
