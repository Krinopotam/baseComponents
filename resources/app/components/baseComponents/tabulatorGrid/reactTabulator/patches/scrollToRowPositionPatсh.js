const elVisible = function (el) {
    return !(el.offsetWidth <= 0 && el.offsetHeight <= 0);
};

const elOffset = function (el) {
    var box = el.getBoundingClientRect();

    return {
        top: box.top + window.pageYOffset - document.documentElement.clientTop,
        left: box.left + window.pageXOffset - document.documentElement.clientLeft,
    };
};

const scrollToRowPosition = function (row, position, ifVisible) {
    var rowIndex = this.rows().indexOf(row),
        rowEl = row.getElement(),
        offset = 0;

    return new Promise((resolve, reject) => {
        if (rowIndex > -1) {
            if (typeof ifVisible === 'undefined') {
                ifVisible = this.table.options.scrollToRowIfVisible;
            }

            //check row visibility
            if (!ifVisible) {
                if (elVisible(rowEl)) {
                    offset = elOffset(rowEl).top - elOffset(this.elementVertical).top;

                    if (offset > 0 && offset < this.elementVertical.clientHeight - rowEl.offsetHeight) {
                        resolve();
                        return false;
                    }
                }
            }

            if (typeof position === 'undefined') {
                position = this.table.options.scrollToRowPosition;
            }

            if (position === 'nearest') {
                position = this.scrollToRowNearestTop(row) ? 'top' : 'bottom';
            }

            //scroll to row
            this.scrollToRow(row);

            //align to correct position
            switch (position) {
                case 'middle':
                case 'center':
                    //!TODO: Check if the developer fixed it. The condition did not work correctly due to a rounding error
                    //if(this.elementVertical.scrollHeight - this.elementVertical.scrollTop == this.elementVertical.clientHeight){
                    if (Math.abs(this.elementVertical.scrollHeight - this.elementVertical.scrollTop - this.elementVertical.clientHeight) < 1) {
                        this.elementVertical.scrollTop =
                            this.elementVertical.scrollTop +
                            (rowEl.offsetTop - this.elementVertical.scrollTop) -
                            (this.elementVertical.scrollHeight - rowEl.offsetTop) / 2;
                    } else {
                        this.elementVertical.scrollTop = this.elementVertical.scrollTop - this.elementVertical.clientHeight / 2;
                    }

                    break;

                case 'bottom':
                    //!TODO: Check if the developer fixed it. The condition did not work correctly due to a rounding error
                    //if(this.elementVertical.scrollHeight - this.elementVertical.scrollTop == this.elementVertical.clientHeight){
                    if (Math.abs(this.elementVertical.scrollHeight - this.elementVertical.scrollTop - this.elementVertical.clientHeight) < 1) {
                        this.elementVertical.scrollTop =
                            this.elementVertical.scrollTop - (this.elementVertical.scrollHeight - rowEl.offsetTop) + rowEl.offsetHeight;
                    } else {
                        this.elementVertical.scrollTop = this.elementVertical.scrollTop - this.elementVertical.clientHeight + rowEl.offsetHeight;
                    }

                    break;

                case 'top':
                    this.elementVertical.scrollTop = rowEl.offsetTop;
                    break;
            }

            resolve();
        } else {
            console.warn('Scroll Error - Row not visible');
            reject('Scroll Error - Row not visible');
        }
    });
};

export const scrollToRow = function (row, position, ifVisible) {
    //return this.renderer.scrollToRowPosition(row, position, ifVisible);
    return scrollToRowPosition.call(this.renderer, row, position, ifVisible);
};
