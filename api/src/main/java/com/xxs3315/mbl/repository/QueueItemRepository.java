package com.xxs3315.mbl.repository;

import com.xxs3315.mbl.entity.QueueItem;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface QueueItemRepository extends JpaRepository<QueueItem, Long> {

  Optional<QueueItem> findByTaskId(String taskId);

  List<QueueItem> findByStatusOrderByCreateTimeAsc(QueueItem.TaskStatus status);

  @Query("SELECT COUNT(q) FROM QueueItem q WHERE q.status = :status")
  long countByStatus(@Param("status") QueueItem.TaskStatus status);

  @Query("SELECT q FROM QueueItem q WHERE q.status = 'PENDING' ORDER BY q.createTime ASC LIMIT 1")
  Optional<QueueItem> findFirstPendingTask();

  @Query(
      value =
          "SELECT q.* FROM queue_items q WHERE q.status = 'PENDING' ORDER BY q.create_time ASC LIMIT 1 FOR UPDATE",
      nativeQuery = true)
  Optional<QueueItem> findFirstPendingTaskForUpdate();

  void deleteByStatus(QueueItem.TaskStatus status);
}
