var React = require('react');

var PrevButton = React.createClass({
    render: function() {
        return (
            <button>Prev</button>
        );
    }
});

var PlayButton = React.createClass({
    render: function() {
        return (
            <button>Play</button>
        );
    }
});

var NextButton = React.createClass({
    render: function() {
        return (
            <button>Next</button>
        );
    }
});

var Transport = React.createClass({
    render: function() {
        return (
            <div>
                <PrevButton></PrevButton>
                <PlayButton></PlayButton>
                <NextButton></NextButton>
            </div>
        )
    }
});
