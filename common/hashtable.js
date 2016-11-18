/**HashTable Class***/
function HashTable(obj)
{
    this.length = 0;
    this.items = {};
    for (var p in obj) {
        if (this.hasItem(p)) {
            this.items[p] = obj[p];
            this.length++;
        }
    }

    /****Method is use for storing the bulk of object in hashset***/
    this.setItemObject=function(obj){
      for (var p in obj) {
          if (!this.hasItem(p)) {
              this.items[p] = obj[p];
              this.length++;
          }
      }
    }

    /*** Mehtod is use for ****/
    this.setItem = function(key, value)
    {
        var previous = undefined;
        if (this.hasItem(key)) {
            previous = this.items[key];
        }
        else {
            this.length++;
        }
        this.items[key] = value;
        return previous;
    }

    this.getItem = function(key) {
        return this.hasItem(key) ? this.items[key] : undefined;
    }

    this.hasItem = function(key)
    {
        return this.items.hasOwnProperty(key);
    }

    this.removeItem = function(key)
    {
        if (this.hasItem(key)) {
            previous = this.items[key];
            this.length--;
            delete this.items[key];
            return previous;
        }
        else {
            return undefined;
        }
    }

    this.keys = function()
    {
        var keys = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                keys.push(k);
            }
        }
        return keys;
    }

    this.values = function()
    {
        var values = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    }
    this.clear = function()
    {
        this.items = {}
        this.length = 0;
    }
}

module.exports=new HashTable();
