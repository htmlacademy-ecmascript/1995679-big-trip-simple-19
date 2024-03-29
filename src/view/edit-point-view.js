import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeDate, capitalizeFirstLetter } from '../utils.js';
import {
  DATE_FORMAT_DATE_AND_TIME,
  POINT_TYPES,
  DESTINATIONS,
} from '../const.js';
import {
  getOffersForPointType,
  getDestinationForPointId,
  getDestinationForName,
} from '../mock/mockData.js';

const renderOffersForPointType = (offers) =>
  offers
    .map(
      (offer) => `<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-train-1" type="checkbox" name="event-offer-train">
  <label class="event__offer-label" for="event-offer-train-1">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </label></div>`
    )
    .join('');

const renderPicturesForDestination = (pictures) =>
  pictures
    .map(
      (picture) =>
        `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`
    )
    .join('');

const createEditPointTemplate = (point) => {
  const offersForPointType = getOffersForPointType(point);
  const eventTypeList = POINT_TYPES.map(
    (eventType) => `<div class="event__type-item">
  <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}">
  <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${capitalizeFirstLetter(
  eventType
)}</label>
</div>`
  ).join('');
  const { basePrice, dateFrom, dateTo, type } = point;
  return `<li class="trip-events__item"><form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${eventTypeList}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${
  getDestinationForPointId(point).name
}" list="destination-list-1">
      <datalist id="destination-list-1">
        <option value="${DESTINATIONS[0]}"></option>
        <option value="${DESTINATIONS[1]}"></option>
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(
    dateFrom,
    DATE_FORMAT_DATE_AND_TIME
  )}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(
    dateTo,
    DATE_FORMAT_DATE_AND_TIME
  )}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">

        ${renderOffersForPointType(offersForPointType.offers)}

      </div>
    </section>

    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${
  getDestinationForPointId(point).description
}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${renderPicturesForDestination(
    getDestinationForPointId(point).pictures
  )}
        </div>
      </div>

    </section>
  </section>
</form></li>`;
};

export default class EditPointView extends AbstractStatefulView {
  #handleClose = null;
  #handleEventTypeChange = null;
  #handleDestinationChange = null;
  #handleEditFormSubmit = null;

  constructor(point, onClose) {
    super();
    this._setState(EditPointView.parsePointToState(point));

    this.#handleClose = onClose;
    this.#handleEventTypeChange = (evt) => {
      this.updateElement({
        type: evt.target.value
      });
    };
    this.#handleDestinationChange = (evt) => {
      this.updateElement({
        destination: getDestinationForName(evt.target.value).id
      });
    };
    this.#handleEditFormSubmit = onClose;
    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state);
  }

  _restoreHandlers() {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#handleClose);
    this.element
      .querySelector('.event--edit')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element
      .querySelector('.event__type-list')
      .addEventListener('change', this.#handleEventTypeChange);
    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#handleDestinationChange);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleClose();
    this.#handleEditFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  static parsePointToState(point) {
    return { ...point };
  }

  static parseStateToPoint(state) {
    return { ...state };
  }
}
