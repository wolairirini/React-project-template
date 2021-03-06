import axios from 'axios';
import {message} from 'antd';

// 获取数据
export function get_infos_ip(){
    return (dispatch)=>{
        return axios({
            url:'/api/sta/get',
        }).then(data=>{
            dispatch({
                type:'GETINFOSIP_SUCCESS',
                payload:Array.isArray(data)?data:[]
            })
        }).catch(err=>{
            dispatch({
                type:'GETINFOSIP_FAILED'
            })
        })
    }
}

//修改设备名
export function set_infos_ip(data){
    console.log(data)
    return (dispatch)=>{
        dispatch({
            type:'SETINFOSIP_PENDING'
        })
        return axios({
            url:'/api/sta/update',
            method:'post',
            data:data
        }).then(data=>{
            message.success('设置成功');
            dispatch({
                type:'SETINFOSIP_SUCCESS'
            })
        }).catch(err=>{
            // console.log(err)
            dispatch({
                type:'SETINFOSIP_FAILED'
            });
            message.error(err.message);
        })
    }
}