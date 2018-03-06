import './keyboard.scss';

interface Ck_options {
    // 自定义样式
    wrapClass?: string;
    // 是否已存在
    isExist?: boolean;
    // 是否显示背景遮罩
    isShowBg?: boolean;
    // 输入完成回调
    compelete?: Function;
    // 输出数字
    outputNum?: Function;
}

class Cyykeyboard {

    private sCkID: string = '';
    private oBody: any = null;
    private oCyyKeyboard: any = null;
    private oBodyCurPos: number = 0;
    private aInputNum: Array<string> = [];
    private isExist: boolean = false;
    private isShowBg: boolean = false;
    private compelete: Function;
    private outputNum: Function;

    constructor(id: string = 'cyy-keyboard') {
        this.sCkID = id;
    }

    init(options: Ck_options) {
        const wrapClass = options.wrapClass || '';
        this.compelete = options.compelete;
        this.isShowBg = options.isShowBg;
        this.outputNum = options.outputNum;

        if (this.isExist) return;

        document.body.insertAdjacentHTML('beforeend', `
        <div class="cyy-keyboard-wrap ${wrapClass}" id="${this.sCkID}">
            <div class="keyboard-wrap" data-cikid="custom-keyboard">
                <div data-ciknum="close" class="keyboard-header-wrap"></div>
                <table class="keyboard-content-wrap">
                    <tbody>
                        <tr>
                            <td data-ciknum="1">1</td>
                            <td data-ciknum="2">2</td>
                            <td data-ciknum="3">3</td>
                        </tr>
                        <tr>
                            <td data-ciknum="4">4</td>
                            <td data-ciknum="5">5</td>
                            <td data-ciknum="6">6</td>
                        </tr>
                        <tr>
                            <td data-ciknum="7">7</td>
                            <td data-ciknum="8">8</td>
                            <td data-ciknum="9">9</td>
                        </tr>
                        <tr>
                            <td class="dark"></td>
                            <td data-ciknum="0">0</td>
                            <td data-ciknum="delete" class="dark delete">x</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            ${options.isShowBg ? '<div data-ciknum="close" class="cyy-keyboard-wrap-bg"></div>' : ''}
        </div>
        `);

        this.isExist = true;
        this.oBody = document.body;
    }

    show(options: Ck_options = {}) {

        if (!this.isExist) {
            this.init(options);
        }

        if (window.location.href.indexOf('#cyykeyboard') === -1) {
            window.history.pushState(null, null, '#cyykeyboard');
        }

        this.aInputNum = [];
        this.oCyyKeyboard = document.getElementById(this.sCkID);

        const scrollTop = window.pageYOffset
            || document.documentElement.scrollTop
            || 0;
        this.oBodyCurPos = scrollTop;
        this.oBody.style.top = -1 * scrollTop + 'px';
        this.oBody.style.position = 'fixed';

        setTimeout(() => {
            this.oCyyKeyboard.classList.add('show-animate');
        }, 50);

        this.handle();
    }

    handle() {
        document.addEventListener('click', (ev) => {
            const oEvent = ev || event;
            const oTarget = oEvent.srcElement;
            if (oTarget['dataset']['ciknum']) {
                switch (oTarget['dataset']['ciknum']) {
                    case 'close':
                        this.hide();
                        break;
                    case 'delete':
                        if (this.aInputNum.length === 0) return;
                        // 删除输入的值
                        this.aInputNum.pop();
                        this.outputNum && this.outputNum(this.aInputNum.join(''));
                        break;
                    default:
                        // 保存输入的值
                        this.aInputNum.push(oTarget['dataset']['ciknum']);
                        this.outputNum && this.outputNum(this.aInputNum.join(''));
                }
            }
        }, false);

        // 监听安卓的后退键，当 url hash 有改变时，关闭输入界面
        window.addEventListener('hashchange', () => {
            if (window.location.href.indexOf('#cyykeyboard') === -1) {
                this.hide();
            }
        }, false);
    }

    hide(isRemove: boolean = false) {

        // 恢复位置
        this.oBody.style.overflow = '';
        this.oBody.style.position = null;
        this.oBody.style.top = null;
        window.scrollTo(0, this.oBodyCurPos);

        this.aInputNum = [];
        this.oCyyKeyboard.classList.remove('show-animate');
        setTimeout(() => {
            if (document.body.contains(this.oCyyKeyboard)) {
                this.handle = function () { };
                if (window.location.href.indexOf('#cyykeyboard') !== -1) {
                    window.history.back();
                }
                if (isRemove) {
                    document.body.removeChild(this.oCyyKeyboard);
                    this.isExist = false;
                }
            }
        }, 250);
    }

    close() {
        this.hide(true);
    }

}

export { Cyykeyboard };