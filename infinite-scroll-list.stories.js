import React, { useCallback, useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import InfiniteScrollList from './infinite-scroll-list';

function InfiniteScrollDemo() {
	const [additionalItems, setAdditionalItems] = useState([]);
	const [loading, setLoading] = useState(false);

	const handleScrollBottom = useCallback((entity) => {
		if (!loading) {
			action('Intersecting the bottom')(entity);
			setLoading(true);
			setTimeout(() => {
				setAdditionalItems(prev => {
					return prev
						.concat(<div style={{ height: 30 }} key={prev.length}>this is #{prev.length}</div>)
						.concat(<div style={{ height: 30 }} key={prev.length + 1}>this is #{prev.length + 1}</div>)
						.concat(<div style={{ height: 30 }} key={prev.length + 2}>this is #{prev.length + 2}</div>);
				});
				setLoading(false);
			}, 2000);
		}
	}, [loading]);

	return (
		<div style={{ width: 400, height: 100 }}>
			<InfiniteScrollList
				containerId="my-container"
				onScrollBottomIntersection={handleScrollBottom}
				loadingMore={loading}
			>
				<div style={{ height: 30 }}>foo</div>
				<div style={{ height: 30 }}>bar</div>
				<div style={{ height: 30 }}>baz</div>
				<div style={{ height: 30 }}>boo</div>
				<div style={{ height: 30 }}>foo</div>
				<div style={{ height: 30 }}>bar</div>
				<div style={{ height: 30 }}>baz</div>
				<div style={{ height: 30 }}>boo</div>
				<div style={{ height: 30 }}>idk</div>
				{additionalItems}
			</InfiniteScrollList>
		</div>
	);
}

storiesOf('Infinite Scroll List', module)
	.add('Infinite Scroll with Loader', () => {
		return (
			<div>
				<h1>Observe the actions tab to see callbacks / loading occur</h1>
				<InfiniteScrollDemo/>
			</div>
		);
	});
