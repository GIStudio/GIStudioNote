---
title: Stable Baseline 3 的使用
tags:
  - RL
  - PPO
  - VecEnv
  - Gym
  - OpenAI
  - Gymnasium
  - API
  - StableBaseline3
website: https://stable-baselines3.readthedocs.io/en/master/guide/vec_envs.html#dummyvecenv
---

## VecEnv API
以下是一个通用的技术文档，概述了 [Stable-Baselines3 (SB3)](https://stable-baselines3.readthedocs.io/en/master/guide/vec_envs.html#dummyvecenv) 的 VecEnv API 与 Gym/Gymnasium API 在强化学习环境接口上的技术差异。这份文档不涉及具体代码细节，而是聚焦于两者的设计理念和实现差异，适用于开发者理解和适配这两种接口。

---

Stable-Baselines3 VecEnv API 与 Gym/Gymnasium API 的技术差异

在强化学习开发中，环境接口是算法与模拟环境交互的核心。Stable-Baselines3 (SB3) 提供了一个向量化环境接口 (VecEnv)，用于支持并行多环境训练，而 Gym（以及其后继者 Gymnasium）则提供了单环境的标准接口。尽管两者在功能上有重叠，但由于 SB3 的特殊需求（如并行性和一致性），其 VecEnv API 与 Gym/Gymnasium API 在设计和实现上存在显著差异。本文档将详细对比两者的技术差异，帮助开发者理解并适配这两种接口。

1. API 背景与目标

- Gym/Gymnasium API：
    
    - 设计目标是为单环境提供标准化的强化学习接口。
        
    - Gym 的早期版本（如 0.21）定义了基本的 reset() 和 step() 返回值格式，而 Gymnasium（基于 Gym 0.26+）进一步细化了终止和截断的语义。
        
    - 适用于单线程实验和简单实现。
        
- SB3 VecEnv API：
    
    - 设计目标是支持多环境并行训练，提高数据采集效率，适配 SB3 的强化学习算法。
        
    - 基于 Gym 0.21 的接口设计，但针对向量化需求进行了调整，与 Gymnasium 的最新标准有所不同。
        
    - 强调一致性和自动化（如自动重置）。
        

2. 主要技术差异

2.1 reset() 方法

- Gym/Gymnasium：
    
    - 返回值：(observation, info)，一个包含观察值和额外信息的元组。
        
    - 参数：支持 seed 和 options，用于设置随机种子和环境选项。
        
    - 每次重置需要显式调用。
        
- SB3 VecEnv：
    
    - 返回值：仅返回 observation（无 info 元组），info 被存储在 vec_env.reset_infos 属性中。
        
    - 参数：不支持直接传入 seed 或 options，需通过 vec_env.seed(seed) 和 vec_env.set_options(options) 分别设置，随后调用 reset()。
        
    - 自动重置：首次调用 reset() 后，后续回合结束时环境会自动重置，无需手动调用。
        

2.2 step() 方法

- Gym/Gymnasium：
    
    - 返回值：(observation, reward, terminated, truncated, info)，一个 5 元组。
        
        - terminated：表示环境因自然结束（如任务完成）而终止。
            
        - truncated：表示环境因外部限制（如时间步上限）而截断。
            
        - info：字典，包含额外信息。
            
    - 输入：action 是单环境的动作。
        
- SB3 VecEnv：
    
    - 返回值：(observations, rewards, dones, infos)，一个 4 元组。
        
        - observations, rewards, dones：NumPy 数组，形状为 (n_envs, ...)，表示多个环境的批量数据。
            
        - dones：布尔数组，dones[i] = terminated[i] or truncated[i]，合并了终止和截断状态。
            
        - infos：字典列表，infos[i] 对应第 i 个环境的额外信息。
            
        - 截断信息：infos[i]["TimeLimit.truncated"] 表示是否因超时截断，terminated[i] = dones[i] and not infos[i]["TimeLimit.truncated"]。
            
    - 输入：actions 是形状为 (n_envs, action_shape) 的数组，匹配环境数量。
        

2.3 回合结束与自动重置

- Gym/Gymnasium：
    
    - 回合结束（terminated 或 truncated 为 True）后，环境状态保持不变，需手动调用 reset()。
        
    - 不提供最后一帧观察值。
        
- SB3 VecEnv：
    
    - 回合结束（dones[i] == True）后，环境自动重置。
        
    - 最后一帧观察值存储在 infos[i]["terminal_observation"] 中，可用于 bootstrapping（如值函数估计）。
        

2.4 渲染 (render())

- Gym/Gymnasium：
    
    - 支持多种渲染模式（如 "human", "rgb_array"），但每个环境实例只能绑定一种模式。
        
    - 返回值取决于模式（例如，"rgb_array" 返回图像数组）。
        
- SB3 VecEnv：
    
    - 推荐使用 "rgb_array" 模式，返回批量图像数组（形状为 (n_envs, height, width, channels)）。
        
    - 如果未指定模式或指定 "rgb_array"，使用默认渲染；其他模式（如 "human"）通过 OpenCV 显示。
        
    - 限制：非 "rgb_array" 模式下，只能调用无参数的 render()。
        

2.5 属性与方法访问

- Gym/Gymnasium：
    
    - 直接通过环境实例访问属性（如 env.attribute）和方法（如 env.method()）。
        
- SB3 VecEnv：
    
    - 通过专用方法访问底层环境：
        
        - vec_env.get_attr("attribute_name")：获取属性。
            
        - vec_env.set_attr("attribute_name", value)：设置属性。
            
        - vec_env.env_method("method_name", *args, **kwargs)：调用方法。
            
    - 返回值是列表或数组，反映多个环境的结果。
        

3. 数据形状与并行性

- Gym/Gymnasium：
    
    - 所有输入和输出针对单环境，数据形状无批量维度。
        
    - 并行性需开发者自行实现（如多线程或多进程）。
        
- SB3 VecEnv：
    
    - 输入和输出带有批量维度（如 (n_envs, ...)），支持多个环境并行运行。
        
    - 提供 DummyVecEnv（单线程）和 SubprocVecEnv（多进程）两种实现。
        

4. 语义差异与适配建议

- 终止与截断：
    
    - Gymnasium 将 terminated 和 truncated 分开定义，而 SB3 将其合并为 dones，通过 infos 区分。
        
    - 适配时，需从 dones 和 infos["TimeLimit.truncated"] 推导 terminated 和 truncated。
        
- 自动重置：
    
    - SB3 的自动重置简化了训练循环，但可能影响需要显式控制重置的场景。
        
    - 可通过检查 dones 和 infos["terminal_observation"] 处理回合边界。
        
- 返回值数量：
    
    - Gymnasium 的 5 元组和 SB3 的 4 元组差异是常见错误来源。
        
    - 使用 SB3 时，需调整解包逻辑，避免假设 step() 返回 5 个值。
        

5. 适用场景

- Gym/Gymnasium：
    
    - 适合单环境实验、快速原型开发或不需要并行训练的场景。
        
    - 与最新强化学习库（如 Gymnasium 的生态）兼容性更好。
        
- SB3 VecEnv：
    
    - 适合需要高效并行训练的强化学习任务，尤其是与 SB3 算法（如 PPO、A2C）结合使用。
        
    - 提供开箱即用的多环境支持，减少手动并行管理的复杂性。
        

6. 总结

SB3 的 VecEnv API 在 Gym 0.21 基础上进行了优化，强调并行性、一致性和自动化，而 Gymnasium 则在单环境接口上进一步标准化了语义（如 terminated 和 truncated）。开发者在适配时需注意返回值格式、自动重置行为和批量数据处理，以确保代码与目标库兼容。对于混合使用场景，建议明确区分单环境和向量化环境的调用逻辑，或使用 SB3 提供的工具函数进行转换。
