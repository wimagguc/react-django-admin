var RDA = RDA || {};
RDA.Views = RDA.Views || {};

RDA.Views.EmptyView = React.createClass({
  	render: function() {
		return (
			<div></div>
		);
	}
});

RDA.Views.renderEmptyView = function() {
	React.render(
		<RDA.Views.EmptyView/>,
		document.getElementById('app')
	);
}
