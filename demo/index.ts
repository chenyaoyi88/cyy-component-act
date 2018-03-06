import './sass/index.scss';
import { modal, toast, loading, cInputKeyboard, cKeyboard, Cyykeyboard } from '../src';
import * as IMG_success from './image/success.png';

window.onload = function () {
    
    const cyyKeyboard = new Cyykeyboard('abc');

    document.addEventListener('click', function (ev) {
        const oEvent = ev || event;
        const oTarget = oEvent.srcElement;

        switch (oTarget['id']) {
            case 'show-modal-text':
                modal.show({
                    content: '测试弹窗显示文字',
                    isShowAnimate: true
                });
                break;
            case 'show-modal-img':
                modal.show({
                    content: `
                    <div class="modal-img-wrap">
                        <img class="img" src="${IMG_success}" alt="">
                    </div>
                    <div class="modal-text">
                        <p class="text">测试弹窗显示文字和图片</p>
                    </div>`,
                    isShowAnimate: true
                });
                break;
            case 'show-toast':
                toast('这是测试 toast 提示');
                break;
            case 'show-loading':
                loading.show();
                setTimeout(function () {
                    loading.hide();
                }, 1000);
                break;
            case 'show-custom-keyboard':
                cInputKeyboard.show({
                    wrapClass: 'fuck',
                    title: '请输入验证码',
                    isShowInput: true,
                    len: 6,
                    compelete: function (data: string) {
                        console.log(data);
                        setTimeout(() => {
                            cInputKeyboard.close();
                        }, 1000);
                    }
                });
                break;
            case 'show-cyy-keyboard':
                cyyKeyboard.show({
                    isShowBg: true,
                    outputNum: function (data: string) {
                        console.log(data);
                        if (data.length === 5) {
                            loading.show();
                            setTimeout(function () {
                                loading.hide();
                                cyyKeyboard.close();
                            }, 1000);
                        }
                    }
                });
                break;
        }

    }, false);
};