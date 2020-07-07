"use strict";
// Source code: https://codepen.io/myjian/pen/abdqveg?editors=0010
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var DX_MAX_RATING = 211; // 15.0 * 14 * 1.005
var DX_RANKS = [
    {
        "title": "SSS+",
        "minAchv": 100.5,
        "rankFactor": 15,
        "maxAchv": 100.5
    },
    {
        "title": "SSS",
        "minAchv": 100,
        "rankFactor": 14,
        "maxAchv": 100.4999
    },
    {
        "title": "SS+",
        "minAchv": 99.5,
        "rankFactor": 13,
        "maxAchv": 99.9999,
        "maxRankFactor": 13.5
    },
    {
        "title": "SS",
        "minAchv": 99,
        "rankFactor": 12,
        "maxAchv": 99.4999
    },
    {
        "title": "S+",
        "minAchv": 98,
        "rankFactor": 11,
        "maxAchv": 98.9999
    },
    {
        "title": "S",
        "minAchv": 97,
        "rankFactor": 10,
        "maxAchv": 97.9999
    },
    {
        "title": "AAA",
        "minAchv": 94,
        "rankFactor": 9.4,
        "maxAchv": 96.9999
    },
    {
        "title": "AA",
        "minAchv": 90,
        "rankFactor": 9,
        "maxAchv": 93.99999
    },
    {
        "title": "A",
        "minAchv": 80,
        "rankFactor": 8,
        "maxAchv": 89.9999
    }
];
var DX_PLUS_RANKS = [
    {
        "title": "SSS+",
        "minAchv": 100.5,
        "rankFactor": 14,
        "maxAchv": 100.5
    },
    {
        "title": "SSS",
        "minAchv": 100,
        "rankFactor": 13.5,
        "maxAchv": 100.4999
    },
    {
        "title": "SS+",
        "minAchv": 99.5,
        "rankFactor": 13.2,
        "maxAchv": 99.9999
    },
    {
        "title": "SS",
        "minAchv": 99,
        "rankFactor": 13,
        "maxAchv": 99.4999
    },
    {
        "title": "S+",
        "minAchv": 98,
        "rankFactor": 12.7,
        "maxAchv": 98.9999
    },
    {
        "title": "S",
        "minAchv": 97,
        "rankFactor": 12.5,
        "maxAchv": 97.9999
    },
    {
        "title": "AAA",
        "minAchv": 94,
        "rankFactor": 10.5,
        "maxAchv": 96.9999
    },
    {
        "title": "AA",
        "minAchv": 90,
        "rankFactor": 9.5,
        "maxAchv": 93.9999
    },
    {
        "title": "A",
        "minAchv": 80,
        "rankFactor": 8.5,
        "maxAchv": 89.9999
    },
];
var DX_PLUS_LEVELS = [
    { title: "15", minLv: 15.0, maxLv: 15.6 },
    { title: "14+", minLv: 14.7, maxLv: 14.9 },
    { title: "14", minLv: 14.0, maxLv: 14.6 },
    { title: "13+", minLv: 13.7, maxLv: 13.9 },
    { title: "13", minLv: 13.0, maxLv: 13.6 },
    { title: "12+", minLv: 12.7, maxLv: 12.9 },
    { title: "12", minLv: 12.0, maxLv: 12.6 },
    { title: "11+", minLv: 11.7, maxLv: 11.9 },
    { title: "11", minLv: 11.0, maxLv: 11.6 },
    { title: "10+", minLv: 10.7, maxLv: 10.9 },
    { title: "10", minLv: 10.0, maxLv: 10.6 },
    { title: "9+", minLv: 9.7, maxLv: 9.9 },
    { title: "9", minLv: 9.0, maxLv: 9.6 },
    { title: "8+", minLv: 8.7, maxLv: 8.9 },
    { title: "8", minLv: 8.0, maxLv: 8.6 },
];
DX_PLUS_LEVELS[0].maxLv = 15.0;
var DX_LEVELS = DX_PLUS_LEVELS.slice(2);
DX_LEVELS[0] = { title: "14", minLv: 14.0, maxLv: 14.0 };
var LvLabel = /** @class */ (function (_super) {
    __extends(LvLabel, _super);
    function LvLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LvLabel.prototype.render = function () {
        var _a = this.props, canZoomIn = _a.canZoomIn, onClick = _a.onClick, title = _a.title;
        return (React.createElement("div", { className: "lvLabel" },
            React.createElement("div", { className: "lvLabelButtonContainer" },
                React.createElement("button", { className: "lvLabelButton", disabled: !canZoomIn, onClick: onClick }, title))));
    };
    return LvLabel;
}(React.PureComponent));
var LvRankRatingSegment = /** @class */ (function (_super) {
    __extends(LvRankRatingSegment, _super);
    function LvRankRatingSegment() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.minRt = 0;
        _this.maxRt = 0;
        _this.handleClick = function () {
            _this.props.highlightInterval(_this.minRt, _this.maxRt);
        };
        return _this;
    }
    LvRankRatingSegment.prototype.render = function () {
        var _a = this.props, minLv = _a.minLv, minAchv = _a.minAchv, rankFactor = _a.rankFactor, maxLv = _a.maxLv, maxAchv = _a.maxAchv, maxRankFactor = _a.maxRankFactor, heightUnit = _a.heightUnit, title = _a.title;
        this.minRt = Math.floor(minLv * minAchv * rankFactor / 100);
        this.maxRt = Math.floor(maxLv * maxAchv * (maxRankFactor || rankFactor) / 100);
        var style = {
            bottom: (this.minRt - 0.5) * heightUnit + "px",
            height: (this.maxRt - this.minRt + 1) * heightUnit + "px",
        };
        var hoverText = this.minRt < this.maxRt ? this.minRt + " - " + this.maxRt : this.maxRt;
        var className = "ratingSegment " + "segment" + title.replace("+", "P");
        return (React.createElement("div", { className: className, style: style, title: hoverText, tabIndex: 0, onClick: this.handleClick },
            React.createElement("div", { className: "ratingSegmentLabel" }, title)));
    };
    return LvRankRatingSegment;
}(React.PureComponent));
var LvRatingContainer = /** @class */ (function (_super) {
    __extends(LvRatingContainer, _super);
    function LvRatingContainer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleLabelClick = function () {
            var _a = _this.props, lvTitle = _a.lvTitle, minLv = _a.minLv, maxLv = _a.maxLv;
            _this.props.onZoomIn(lvTitle, minLv, maxLv);
        };
        return _this;
    }
    LvRatingContainer.prototype.render = function () {
        var _this = this;
        var _a = this.props, canZoomIn = _a.canZoomIn, lvTitle = _a.lvTitle, minLv = _a.minLv, maxLv = _a.maxLv, width = _a.width, heightUnit = _a.heightUnit, containerHeight = _a.containerHeight, ranks = _a.ranks;
        var style = {
            height: containerHeight + "px",
        };
        return (React.createElement("div", { className: "lvRatingContainer", style: style },
            React.createElement(LvLabel, { title: lvTitle, onClick: this.handleLabelClick, canZoomIn: canZoomIn }),
            ranks.map(function (rank) { return (React.createElement(LvRankRatingSegment, { key: rank.title, minLv: minLv, maxLv: maxLv, minAchv: rank.minAchv, maxAchv: rank.maxAchv, rankFactor: rank.rankFactor, maxRankFactor: rank.maxRankFactor, heightUnit: heightUnit, title: rank.title, highlightInterval: _this.props.highlightInterval })); })));
    };
    return LvRatingContainer;
}(React.PureComponent));
var RatingAxis = /** @class */ (function (_super) {
    __extends(RatingAxis, _super);
    function RatingAxis() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RatingAxis.prototype.render = function () {
        var _a = this.props, step = _a.step, maxRating = _a.maxRating, heightUnit = _a.heightUnit, containerHeight = _a.containerHeight, onClick = _a.onClick;
        var containerStyle = {
            height: containerHeight + "px",
        };
        var children = [];
        var i = 0;
        for (i = 0; i < maxRating; i += step) {
            children.push(this.renderLabel(i));
        }
        children.push(this.renderLabel(i));
        return (React.createElement("div", { className: "axisLabelContainer", style: containerStyle, onClick: onClick }, children));
    };
    RatingAxis.prototype.renderLabel = function (i) {
        var childStyle = { bottom: i * this.props.heightUnit + "px" };
        return (React.createElement("div", { className: "axisLabel", style: childStyle },
            React.createElement("span", { className: "axisLabelText" }, i)));
    };
    return RatingAxis;
}(React.PureComponent));
var IntervalLines = /** @class */ (function (_super) {
    __extends(IntervalLines, _super);
    function IntervalLines() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IntervalLines.prototype.render = function () {
        var _a = this.props, interval = _a.interval, heightUnit = _a.heightUnit, onClick = _a.onClick;
        var isCollapsed = interval[0] === interval[1];
        var lowLabelBottom, highLabelBottom;
        var lowLineBottom = lowLabelBottom = (interval[0] - 0.5) * heightUnit - 1;
        var highLineBottom = highLabelBottom = (interval[1] + 0.5) * heightUnit;
        var lowLineStyle = { bottom: lowLineBottom + "px" };
        var highLineStyle = { bottom: highLineBottom + "px" };
        if (isCollapsed) {
            lowLabelBottom += 4;
        }
        else if (highLabelBottom - lowLabelBottom < 14) {
            highLabelBottom += 2;
            lowLabelBottom -= 5;
        }
        var lowLabelStyle = { bottom: lowLabelBottom + "px" };
        var highLabelStyle = { bottom: highLabelBottom + "px" };
        return (React.createElement("div", { onClick: onClick },
            React.createElement("div", { className: "intervalBoundary", style: highLineStyle }),
            React.createElement("div", { className: "intervalBoundary", style: lowLineStyle }),
            React.createElement("div", { className: "intervalLabel", style: lowLabelStyle },
                React.createElement("span", { className: "intervalLabelText axisLabelText" }, interval[0])),
            !isCollapsed && (React.createElement("div", { className: "intervalLabel", style: highLabelStyle },
                React.createElement("span", { className: "intervalLabelText axisLabelText" }, interval[1])))));
    };
    return IntervalLines;
}(React.PureComponent));
var OptionsInput = /** @class */ (function (_super) {
    __extends(OptionsInput, _super);
    function OptionsInput() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleChangeVersion = function (evt) {
            console.log(evt.target);
            var isPlus = evt.target.value === "plus";
            _this.props.onChangeDxPlus(isPlus);
        };
        _this.handleChangeHeightUnit = function (evt) {
            console.log(evt.target);
            var unit = parseInt(evt.target.value);
            _this.props.onChangeHeightUnit(unit);
        };
        return _this;
    }
    OptionsInput.prototype.render = function () {
        var _a = this.props, minLv = _a.minLv, maxLv = _a.maxLv, selectedLv = _a.selectedLv, showZoomOutButton = _a.showZoomOutButton, onZoomOut = _a.onZoomOut, onFocus = _a.onFocus, onBlur = _a.onBlur;
        var lvDisplayed = selectedLv || minLv + " - " + maxLv;
        return (React.createElement("div", { className: "optionsContainer" },
            React.createElement("div", { className: "container", onFocus: onFocus, onBlur: onBlur, tabIndex: -1 },
                React.createElement("label", { class: "optionGroup" },
                    "Game version:\u00A0",
                    React.createElement("select", { onChange: this.handleChangeVersion },
                        React.createElement("option", { value: "dx" }, "DX"),
                        React.createElement("option", { value: "plus" }, "DX+"))),
                React.createElement("label", { class: "optionGroup" },
                    "Scale:\u00A0",
                    React.createElement("select", { onChange: this.handleChangeHeightUnit },
                        React.createElement("option", { value: "3" }, "3x"),
                        React.createElement("option", { value: "4" }, "4x"),
                        React.createElement("option", { value: "5" }, "5x"),
                        React.createElement("option", { value: "8", selected: true }, "8x"),
                        React.createElement("option", { value: "12" }, "12x"))),
                React.createElement("span", { className: "lvRangeLabelContainer" },
                    "Showing\u00A0Level\u00A0",
                    React.createElement("span", { className: "lvRangeLabel" }, lvDisplayed),
                    showZoomOutButton && (React.createElement("button", { class: "resetZoomButton", onClick: onZoomOut }, "Reset"))))));
    };
    return OptionsInput;
}(React.PureComponent));
var RatingVisualizer = /** @class */ (function (_super) {
    __extends(RatingVisualizer, _super);
    function RatingVisualizer(props) {
        var _this = _super.call(this, props) || this;
        _this.removeIntervalTimeout = 0;
        _this.handleDxPlusChange = function (isPlus) {
            _this.setState({ isDxPlus: isPlus });
            if (!isPlus && _this.state.maxLv > 14) {
                _this.handleUnselectLv();
            }
        };
        _this.handleChangeHeightUnit = function (unit) {
            _this.setState({ heightUnit: unit });
        };
        _this.handleSelectLv = function (lvTitle, minLv, maxLv) {
            _this.setState({ selectedLvTitle: lvTitle, minLv: minLv, maxLv: maxLv });
        };
        _this.handleUnselectLv = function () {
            _this.setState({ minLv: undefined, maxLv: undefined, selectedLvTitle: undefined });
        };
        _this.highlightInterval = function (minRt, maxRt) {
            var curItvl = _this.state.highlightInterval;
            if (curItvl && curItvl[0] === minRt && curItvl[1] === maxRt) {
                _this.removeHighlightInterval();
            }
            else {
                _this.setState({ highlightInterval: [minRt, maxRt] });
            }
        };
        _this.removeHighlightInterval = function () {
            console.log("removeInterval");
            _this.removeIntervalTimeout = setTimeout(function () {
                _this.setState({ highlightInterval: undefined });
                _this.removeIntervalTimeout = 0;
            }, 0);
        };
        _this.cancelRemoveHighlightInterval = function () {
            console.log("cancelRemove");
            if (_this.removeIntervalTimeout) {
                clearTimeout(_this.removeIntervalTimeout);
                _this.removeIntervalTimeout = 0;
            }
        };
        _this.state = {
            width: 30,
            heightUnit: 8,
            maxRating: DX_MAX_RATING,
            topPadding: 70,
            isDxPlus: false,
            axisLabelStep: 5,
        };
        return _this;
    }
    RatingVisualizer.prototype.render = function () {
        var _this = this;
        var _a = this.state, isDxPlus = _a.isDxPlus, heightUnit = _a.heightUnit, maxRating = _a.maxRating, width = _a.width, axisLabelStep = _a.axisLabelStep, highlightInterval = _a.highlightInterval, minLv = _a.minLv, selectedLvTitle = _a.selectedLvTitle;
        var levels = this.getLevels();
        var ranks = isDxPlus ? DX_PLUS_RANKS : DX_RANKS;
        var containerHeight = this.getContainerHeight();
        var canZoomIn = !minLv;
        return (React.createElement("div", { class: "ratingVisualizer" },
            React.createElement(OptionsInput, { onChangeDxPlus: this.handleDxPlusChange, onChangeHeightUnit: this.handleChangeHeightUnit, onZoomOut: this.handleUnselectLv, selectedLv: selectedLvTitle, minLv: levels[levels.length - 1].title, maxLv: levels[0].title, showZoomOutButton: !canZoomIn, onBlur: this.removeHighlightInterval, onFocus: this.cancelRemoveHighlightInterval }),
            React.createElement("div", { className: "container", onBlur: this.removeHighlightInterval, onFocus: this.cancelRemoveHighlightInterval, tabIndex: -1 },
                React.createElement("div", { className: "ratingContainer" },
                    React.createElement(RatingAxis, { maxRating: maxRating, heightUnit: heightUnit, containerHeight: containerHeight, step: axisLabelStep, onClick: this.removeHighlightInterval }),
                    levels.map(function (lv) {
                        return (React.createElement(LvRatingContainer, { key: lv.title, canZoomIn: canZoomIn, lvTitle: lv.title, minLv: lv.minLv, maxLv: lv.maxLv, heightUnit: heightUnit, containerHeight: containerHeight, ranks: ranks, onZoomIn: _this.handleSelectLv, highlightInterval: _this.highlightInterval }));
                    }),
                    highlightInterval && (React.createElement(IntervalLines, { interval: highlightInterval, heightUnit: heightUnit, onClick: this.removeHighlightInterval }))))));
    };
    RatingVisualizer.prototype.getLevels = function () {
        var _a = this.state, minLv = _a.minLv, maxLv = _a.maxLv, isDxPlus = _a.isDxPlus;
        if (minLv && maxLv) {
            var lvs = [];
            while (minLv <= maxLv) {
                lvs.push({
                    title: maxLv.toFixed(1),
                    minLv: maxLv,
                    maxLv: maxLv,
                });
                maxLv -= 0.1;
            }
            return lvs;
        }
        return isDxPlus ? DX_PLUS_LEVELS : DX_LEVELS;
    };
    RatingVisualizer.prototype.getContainerHeight = function () {
        var _a = this.state, axisLabelStep = _a.axisLabelStep, maxRating = _a.maxRating, heightUnit = _a.heightUnit, topPadding = _a.topPadding;
        return (maxRating + axisLabelStep) * heightUnit + topPadding;
    };
    return RatingVisualizer;
}(React.PureComponent));
ReactDOM.render(React.createElement(RatingVisualizer, null), document.getElementById("root"));
