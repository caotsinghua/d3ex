function Parent(){
    this.parent=12
}

function extend(parent,child){
    const extended=function(){
        parent.call(this);
        child.call(this)
    }
    extended.prototype=Object.create(parent.prototype)
    extended.prototype.constructor=extended;
    return extended
}

let Child=extend(Parent,function Chil(){
    this.childname='eee'
})

Child.constructor.prototype.add=function(){
    console.log("add")
}
console.dir(Child.constructor)
const a=new Child()
console.log(a)
