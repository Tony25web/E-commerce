class ApiFeatures {
  constructor(MongooseQuery, QueryString) {
    this.MongooseQuery = MongooseQuery;
    this.QueryString = QueryString;
  }
  filter() {
    const queryObj = { ...this.QueryString };
    const excludedFields = ["limit", "sort", "fields", "page", "keyword"];
    excludedFields.forEach((field) => delete queryObj[field]);
    let queryStr = JSON.stringify(this.QueryString);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.MongooseQuery = this.MongooseQuery.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.QueryString.sort) {
      let sortQuery = this.QueryString.sort.split(",").join(" ");
      this.MongooseQuery = this.MongooseQuery.sort(sortQuery);
    } else {
      this.MongooseQuery = this.MongooseQuery.sort("createdAt");
    }
    return this;
  }
  limitFields() {
    if (this.QueryString.fields) {
      let fields = this.QueryString.fields.split(",").join(" ");
      this.MongooseQuery = this.MongooseQuery.select(fields);
    } else {
      this.MongooseQuery = this.MongooseQuery.select("-__v");
    }
    return this;
  }
  search(modelName) {
    if (this.QueryString.keyword) {
      let query = {};
      if (modelName === "Product") {
        query.$or = [
          { title: { $regex: this.QueryString.keyword, $options: "i" } },
          { description: { $regex: this.QueryString.keyword, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.QueryString.keyword, $options: "i" } };
      }
      this.MongooseQuery = this.MongooseQuery.find(query);
    }
    return this;
  }
  pagination(countDocuments) {
    const page = +this.QueryString.page || 1;
    const productLimit = +this.QueryString.limit || 6;
    const skip = (page - 1) * productLimit;
    const endIndex = page * productLimit;
    /* the index of the last product in a page ex 
    (page * limit <countDocuments)=> ((1*5=5) < 25 )=>acceptable (for the next property to be added)*/
    let pagination = {};
    pagination.currentPage = page;
    pagination.limit = productLimit;
    pagination.numbOfPages = Math.ceil(countDocuments / productLimit);
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.previous = page - 1;
    }
    this.PaginationResult = pagination;
    this.MongooseQuery = this.MongooseQuery.skip(skip).limit(productLimit);
    return this;
  }
}
module.exports = { ApiFeatures };
