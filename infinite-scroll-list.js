import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { css, keyframes } from 'emotion';

const animations = {
  loader: keyframes`
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	`,
}

const styles = {
  infiniteScroll: css`
		height: 100%;
		overflow-y: auto;
	`,
  loaderContainer: css`
		text-align: center;
	`,
  loader: css`
		display: inline-block;
		text-align: center;
		&::after {
			content: " ";
			display: block;
			width: 16px;
			height: 16px;
			margin: 8px;
			border-radius: 50%;
			border: 2px solid #222;
			border-color: #222  transparent #222 transparent;
			animation: ${animations.loader} 1.2s linear infinite;	
		}
	`,
};

function InfiniteScrollList({
  children,
  className,
  containerId,
  intersectionObserverOptions,
  loadingMore,
  onScrollBottomIntersection,
}) {
  const rootRef = useRef(null);
  const observer = useRef(null);

  const handleIntersection = useCallback(([entity], observer) => {
    if (entity.isIntersecting && typeof onScrollBottomIntersection === 'function') {
      onScrollBottomIntersection(entity);
      // Only allow sentinel intersection to be observed once
      observer.disconnect();
    }
  }, [onScrollBottomIntersection]);

  useEffect(function registerIntersectionObserver() {
    // Cleanup -- just in case we got here before an existing observer was disconnected - it can happen
    if (observer.current) {
      observer.current.disconnect();
    }

    if ('IntersectionObserver' in window && rootRef.current) {
      // register our observer and keep track of it via ref
      const intersectionObserver = new window.IntersectionObserver(
        handleIntersection,
        {
          root: document.getElementById(containerId),
          ...intersectionObserverOptions,
        }
      );
      observer.current = intersectionObserver;

      // start observing our sentinel - end-of-data element
      const sentinel = document.querySelector(`#${containerId} .intersection-observer-sentinel`);
      if (sentinel) {
        intersectionObserver.observe(sentinel);
      }

      return () => {
        if (observer.current) {
          observer.current.disconnect();
        }
      };
    }
  }, [containerId, handleIntersection, intersectionObserverOptions, onScrollBottomIntersection]);

  return (
    <div
      className={classnames(styles.infiniteScroll, className)}
      data-test-id={containerId}
      id={containerId}
      ref={rootRef}
    >
      {children}
      <span className="intersection-observer-sentinel"/>
      {loadingMore && (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}/>
        </div>
      )}
    </div>
  );
}

InfiniteScrollList.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  containerId: PropTypes.string.isRequired,
  intersectionObserverOptions: PropTypes.object,
  loadingMore: PropTypes.bool,
  onScrollBottomIntersection: PropTypes.func,
};

InfiniteScrollList.defaultProps = {
  intersectionObserverOptions: {
    rootMargin: '0px',
    threshold: 1,
  },
};

export default InfiniteScrollList;
