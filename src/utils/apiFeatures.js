export class ApiFeature {
    constructor(mongooseQuery , queryData){
        this.mongooseQuery = mongooseQuery
        this.queryData
    }

    //pagination
    pagination (){
        let {page , limit} = this.queryData

        if(!page || page <= 0){
            page = 1
        }

        if(!limit || limit <=0){
            limit = 3;
        }

        limit = parseInt(limit);
        page = parseInt(page)

        const skip = (page - 1) * size
      this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip)
      return this
    }

    //sort

    sort(){
        let {sort}= this.queryData
        sort = sort?.replaceAll(',',' ')
    
        this.mongooseQuery= this.mongooseQuery.sort(sort)
        return this
    }

    //select 

    select (){
        let {select} = this.queryData
        select = select?.replaceAll(',',' ')
        this.mongooseQuery= this.mongooseQuery.select(select)
        return this

    }

    fillter(){
        let { page,limit,sort,selecy,...fillter}= this.queryData
          fillter =fillter = JSON.parse(JSON.stringify(fillter).replace(/gt|gte|lt|lte/g, match => `$${match}`))
          this.mongooseQuery = this.mongooseQuery.find(fillter)
          return this

    } 

}