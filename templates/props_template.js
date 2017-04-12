
export const mapStateToProps = state => ({
  someValue: state.someValue
})

export const mapDispatchToProps = dispatch => ({
  updateValue: id => dispatch(updateSomeValue(id))
})
