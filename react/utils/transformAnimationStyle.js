function transformAnimationStyle(quantity, isPickupOpen) {
  return {
    transition: 'transform 300ms',
    transform: `translate3d(${isPickupOpen ? `-${quantity}` : '0'}, 0, 0)`,
  }
}

export default transformAnimationStyle
