var RDA = RDA || {};
RDA.Views = RDA.Views || {};

RDA.Views.HelloView = React.createClass({
  	render: function() {
		return (
			<div>
                Hello
            </div>
		);
	}
});

RDA.Views.renderHelloView = function() {
	React.render(
		<RDA.Views.HelloView/>,
		document.getElementById('app')
	);
}
