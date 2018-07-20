const resolvers = {
  Customer: {
    __resolveType (obj) {
      if (obj._modelOptions.name.singular === 'person') return 'Person';
      if (obj._modelOptions.name.singular === 'organization') return 'Organization';
    }
  }
};

module.exports = resolvers;
