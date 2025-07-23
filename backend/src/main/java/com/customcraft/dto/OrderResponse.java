package com.customcraft.dto;

import com.customcraft.model.Order;
import com.customcraft.model.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Order order;
    private List<OrderItem> items;
}