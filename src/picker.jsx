import React, { Component } from "react";
import PropTypes from "prop-types";
import emojione from "emojione";
import store from "store";
import each from "lodash/each";
import map from "lodash/map";
import omit from "lodash/omit";
import findKey from "lodash/findKey";
import strategy from "emojione/emoji.json";
import Emoji from "./emoji";
import Categories from "./categories";
import createRowsSelector from "./utils/createRowsSelector";
import createEmojisFromStrategy from "./utils/createEmojisFromStrategy";
import { defaultCategories } from "./constants";

export default class Picker extends Component {
  static propTypes = {
    emojione: PropTypes.shape({
      imageType: PropTypes.string,
      sprites: PropTypes.bool,
      imagePathSVGSprites: PropTypes.string
    }),
    search: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    searchPlaceholder: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    categories: PropTypes.object,
    recentlyUsedShortnames: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    search: "",
    searchPlaceholder: "Search…",
    categories: defaultCategories,
    recentlyUsedShortnames: []
  };

  state = {
    modifier: store.get("emoji-modifier") || "0",
    category: false,
    term: this.props.search !== true ? this.props.search : ""
  };

  componentWillMount() {
    this.rowsSelector = createRowsSelector();

    each(this.props.emojione, (value, key) => {
      emojione[key] = value;
    });
    this.setState({ emojis: this._createEmojisFromStrategy() });
  }

  componentDidMount() {
    this.setState({ category: this.categories.getActiveCategory() }); // eslint-disable-line
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.search !== nextProps.search) {
      this.setState({ term: this.props.search });
    }
  }

  setFocus = ev => {
    if (ev.target.id === "flags") {
      this.categories[this.state.category].children[0].focus();
    }
  };

  _renderHeaderCategories = () => {
    return map(this.props.categories, (details, key) => (
      <li
        key={key}
        className={this.state.category === key ? "active" : undefined}
      >
        <Emoji
          id={key}
          role="menuitem"
          ariaLabel={`${key} category`}
          shortname={`:${details.emoji}:`}
          onSelect={() => {
            this.categories.jumpToCategory(key);
          }}
        />
      </li>
    ));
  };

  _renderCategories = () => {
    const rows = this.rowsSelector(
      this.props.categories,
      this.state.emojis,
      this.state.modifier,
      this.props.search,
      this.state.term
    );

    return (
      <div className="emoji-categories-wrapper">
        <Categories
          nonce={this.props.nonce}
          ref={this._setCategoriesRef}
          rows={rows}
          modifier={this.state.modifier}
          onActiveCategoryChange={this._onActiveCategoryChange}
          onChange={this.props.onChange}
          onModifierChange={this._onModifierChange}
        />
      </div>
    );
  };

  _setCategoriesRef = categories => {
    this.categories = categories;
  };

  _setSearchRef = ref => {
    this.search = ref;
  };

  _onActiveCategoryChange = category => {
    if (category !== this.state.category) {
      this.setState({ category });
    }
  };

  _onModifierChange = modifier => {
    this.setState({ modifier });
    store.set("emoji-modifier", modifier);
  };

  _renderSearchInput = () => {
    if (this.props.search === true) {
      return (
        <div className="emoji-search-wrapper">
          <input
            className="emoji-search"
            type="search"
            placeholder={this.props.searchPlaceholder}
            ref={this._setSearchRef}
            onChange={this._updateSearchTerm}
            autoFocus
          />
        </div>
      );
    }

    return null;
  };

  _updateSearchTerm = () => {
    this.setState({ term: this.search.value });
  };

  _createEmojisFromStrategy = () => {
    return {
      recentlyUsed: this.props.recentlyUsedShortnames.reduce(
        (ret, shortname) => {
          const key = findKey(strategy, d => d.shortname === shortname);
          return { ...ret, [key]: [strategy[key]] };
        },
        {}
      ),
      ...createEmojisFromStrategy(strategy)
    };
  };

  render() {
    const props = omit(this.props, Object.keys(Picker.propTypes));
    let classes = "emoji-dialog";
    if (this.props.search === true) classes += " with-search";
    if (this.props.className) classes += ` ${this.props.className}`;

    return (
      <div className={classes} role="dialog" {...props}>
        <header className="emoji-dialog-header" role="menu">
          <ul onBlur={this.setFocus}>{this._renderHeaderCategories()}</ul>
        </header>
        {this._renderSearchInput()}
        {this._renderCategories()}
      </div>
    );
  }
}
